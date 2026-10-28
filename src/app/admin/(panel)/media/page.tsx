import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/MediaManager";
import { listMedia } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Media library" };

export default async function MediaPage() {
  const library = await listMedia();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h3">Media library</h1>
        <p className="mt-1 text-small">
          Every photo and video of the resort, stored in Supabase. Edit a description,
          replace a picture (every room or gallery photo that uses it updates) or delete
          it. Uploads are resized and converted to WebP automatically. A photo that a room
          or the gallery uses can’t be deleted until it’s removed there.
        </p>
      </div>
      <MediaManager library={library} />
    </div>
  );
}
