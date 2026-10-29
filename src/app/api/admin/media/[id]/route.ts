import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/auth";
import { newPath, processImage, repointReferences } from "@/lib/admin/media-ops";
import { CONTENT_TAG, KEYS, invalidate } from "@/lib/cache";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Replaces the picture of an existing library file. The new file gets a fresh URL (so no browser or
 * CDN keeps showing the old one), every room or gallery photo that used the old file is switched to
 * it, and the old file is removed from storage.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  const { id } = await params;
  if (!UUID.test(id))
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const supabase = createServiceClient();
  const { data: current } = await supabase
    .from("media")
    .select("id, path, url, folder, mime")
    .eq("id", id)
    .maybeSingle();
  if (!current)
    return NextResponse.json({ ok: false, error: "File not found." }, { status: 404 });
  if (!String(current.mime).startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "Only photos can be replaced." },
      { status: 400 },
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a photo." }, { status: 400 });
  }

  let image;
  try {
    image = await processImage(file);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "That file could not be used. Use a JPG, PNG or WebP under 15 MB.",
      },
      { status: 400 },
    );
  }

  const path = newPath(current.folder);
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, image.bytes, { contentType: "image/webp", cacheControl: "31536000" });
  if (uploadError) {
    return NextResponse.json(
      { ok: false, error: "Upload failed. Try again." },
      { status: 500 },
    );
  }
  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  const { data: row, error } = await supabase
    .from("media")
    .update({
      path,
      url: pub.publicUrl,
      mime: "image/webp",
      width: image.width,
      height: image.height,
      blur: image.blur,
      size_bytes: image.bytes.length,
      original_name: file.name.slice(0, 200),
    })
    .eq("id", id)
    .select("id, path, url, alt, folder, mime, width, height, size_bytes")
    .single();
  if (error) {
    await supabase.storage.from("media").remove([path]);
    return NextResponse.json(
      { ok: false, error: "Could not save. Try again." },
      { status: 500 },
    );
  }

  let usedIn: string[] = [];
  try {
    usedIn = await repointReferences([current.url, `/${current.path}`], {
      src: pub.publicUrl,
      width: image.width,
      height: image.height,
      blur: image.blur,
    });
  } catch {
    // The file itself is replaced; only the references could not be moved. Keep the old file so
    // nothing on the site breaks, and tell the admin.
    return NextResponse.json(
      {
        ok: false,
        error: "Replaced the file but could not update the pages that use it.",
      },
      { status: 500 },
    );
  }

  await supabase.storage.from("media").remove([current.path]);
  await invalidate(KEYS.content, KEYS.dashboard);
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, item: { ...row, usedIn }, updatedPages: usedIn });
}
