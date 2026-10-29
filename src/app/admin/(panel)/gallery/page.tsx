import type { Metadata } from "next";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { gallery as staticGallery } from "@/data/gallery";
import { getContentValue, listMedia } from "@/lib/admin/queries";
import { GALLERY_KEY, type GalleryContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const [stored, library] = await Promise.all([
    getContentValue<GalleryContent>(GALLERY_KEY),
    listMedia(),
  ]);
  const source = stored?.images?.length ? stored.images : staticGallery;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h3">Gallery</h1>
        <p className="mt-1 text-small">
          The photos on the public Gallery page. Add, remove, reorder, describe and
          categorise them.
        </p>
      </div>
      <GalleryEditor
        initialItems={source.map((image) => ({
          src: image.src,
          alt: image.alt,
          category: image.category,
        }))}
        customised={!!stored?.images?.length}
        library={library}
      />
    </div>
  );
}
