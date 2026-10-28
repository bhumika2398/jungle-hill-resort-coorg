import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { rooms } from "@/data/rooms";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_WIDTH = 2400;

export interface ProcessedImage {
  bytes: Buffer;
  width: number;
  height: number;
  blur: string;
}

/** Resizes to a web-friendly WebP and builds the tiny blur placeholder. Throws on a bad file. */
export async function processImage(file: File): Promise<ProcessedImage> {
  if (!file.type.startsWith("image/") || file.size > MAX_BYTES)
    throw new Error("bad file");
  const input = Buffer.from(await file.arrayBuffer());
  const { data: bytes, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  const tiny = await sharp(bytes).resize(12).blur().jpeg({ quality: 40 }).toBuffer();
  return {
    bytes,
    width: info.width,
    height: info.height,
    blur: `data:image/jpeg;base64,${tiny.toString("base64")}`,
  };
}

export const newPath = (folder: string) => `${folder}/${randomUUID()}.webp`;

/** Human label for a site_content key. */
export function contentLabel(key: string) {
  if (key === "gallery") return "Gallery";
  if (key.startsWith("room:")) {
    const slug = key.slice("room:".length);
    return rooms.find((room) => room.slug === slug)?.category ?? slug;
  }
  return key;
}

/**
 * Points every use of a replaced file at the new one, across all saved room and gallery content.
 * Matches both the Supabase URL and the built-in "/images/..." path the photo originally had.
 * Returns the labels of the content that changed.
 */
export async function repointReferences(
  oldRefs: string[],
  next: { src: string; width: number; height: number; blur: string },
) {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error) throw new Error(error.message);

  const changed: string[] = [];
  for (const row of data ?? []) {
    let touched = false;
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        if (typeof obj.src === "string" && oldRefs.includes(obj.src)) {
          obj.src = next.src;
          obj.width = next.width;
          obj.height = next.height;
          obj.blurDataURL = next.blur;
          touched = true;
        }
        Object.values(obj).forEach(walk);
      }
    };
    walk(row.value);
    if (touched) {
      const { error: saveError } = await supabase
        .from("site_content")
        .update({ value: row.value })
        .eq("key", row.key);
      if (saveError) throw new Error(saveError.message);
      changed.push(contentLabel(row.key as string));
    }
  }
  return changed;
}

/** Map of media id to the content that uses it, for the library's "Used in" labels. */
export async function usageByPath(
  media: { path: string; url: string }[],
): Promise<Map<string, string[]>> {
  const { data } = await createServiceClient().from("site_content").select("key, value");
  const blobs = (data ?? []).map((row) => ({
    label: contentLabel(row.key as string),
    json: JSON.stringify(row.value),
  }));
  const usage = new Map<string, string[]>();
  for (const item of media) {
    const labels = blobs
      .filter(
        (blob) => blob.json.includes(item.url) || blob.json.includes(`"/${item.path}"`),
      )
      .map((blob) => blob.label);
    if (labels.length) usage.set(item.path, labels);
  }
  return usage;
}
