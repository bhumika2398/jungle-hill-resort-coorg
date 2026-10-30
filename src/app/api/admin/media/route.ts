import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/auth";
import { newPath, processImage } from "@/lib/admin/media-ops";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILES = 12;

/** Admin-only photo upload: resizes to a web-friendly WebP, stores it in Supabase, registers it. */
export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const files = (form?.getAll("files") ?? []).filter(
    (item): item is File => item instanceof File,
  );
  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Choose at least one photo." },
      { status: 400 },
    );
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `Upload up to ${MAX_FILES} photos at a time.` },
      { status: 400 },
    );
  }

  const folderRaw = String(form?.get("folder") ?? "uploads");
  const folder =
    folderRaw.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+|\/+$/g, "") || "uploads";
  const supabase = createServiceClient();

  const saved = [];
  const failed: string[] = [];
  for (const file of files) {
    try {
      const image = await processImage(file);
      const path = newPath(folder);
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, image.bytes, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });
      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const { data: row, error } = await supabase
        .from("media")
        .insert({
          path,
          url: pub.publicUrl,
          folder,
          mime: "image/webp",
          alt: "",
          width: image.width,
          height: image.height,
          blur: image.blur,
          size_bytes: image.bytes.length,
          original_name: file.name.slice(0, 200),
        })
        .select("id, path, url, alt, folder, mime, width, height, size_bytes")
        .single();
      if (error) {
        await supabase.storage.from("media").remove([path]);
        throw error;
      }
      saved.push(row);
    } catch {
      failed.push(file.name);
    }
  }

  return NextResponse.json({ ok: saved.length > 0, saved, failed });
}
