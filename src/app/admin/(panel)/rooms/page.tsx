import type { Metadata } from "next";
import Link from "next/link";
import { getRooms } from "@/lib/site-content";

export const metadata: Metadata = { title: "Rooms and prices" };

export default async function AdminRoomsPage() {
  const rooms = await getRooms();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h3">Rooms and prices</h1>
        <p className="mt-1 text-small">
          Set the nightly price and manage the photos of each stay.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <li key={room.slug}>
            <Link
              href={`/admin/rooms/${room.slug}`}
              className="flex h-full gap-4 rounded-[10px] border border-line bg-card p-3 hover:border-burgundy"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={room.images[0]?.src}
                alt=""
                loading="lazy"
                className="h-24 w-32 shrink-0 rounded-[6px] object-cover"
              />
              <span className="min-w-0">
                <span className="block font-display text-h4 leading-tight">
                  {room.name}
                </span>
                <span className="block text-small">{room.category}</span>
                <span className="mt-2 block text-small font-medium">
                  {room.price
                    ? `₹${room.price.toLocaleString("en-IN")} per night`
                    : "No price set"}
                </span>
                <span className="block text-small opacity-80">
                  {room.images.length} photos
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
