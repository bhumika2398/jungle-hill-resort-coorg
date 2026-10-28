import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoomEditor } from "@/components/admin/RoomEditor";
import { getRoomBySlug, roomTitle } from "@/data/rooms";
import { getContentValue, listMedia } from "@/lib/admin/queries";
import { roomKey, type RoomContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Edit stay" };

export default async function AdminRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getRoomBySlug(slug);
  if (!base) notFound();

  const [stored, library] = await Promise.all([
    getContentValue<RoomContent>(roomKey(slug)),
    listMedia(),
  ]);
  const images = stored?.images?.length ? stored.images : base.images;

  return (
    <div className="space-y-6">
      <Link href="/admin/rooms" className="text-small underline underline-offset-4">
        Back to rooms
      </Link>
      <h1 className="font-display text-h3">{roomTitle(base)}</h1>
      <RoomEditor
        slug={slug}
        initialPrice={stored?.price ?? null}
        initialItems={images.map((image) => ({ src: image.src, alt: image.alt }))}
        customised={!!stored}
        library={library}
      />
    </div>
  );
}
