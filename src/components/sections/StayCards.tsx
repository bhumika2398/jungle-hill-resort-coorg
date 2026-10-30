"use client";

import { useState } from "react";
import { HoverLink as Link } from "@/components/shared/HoverLink";
import { FadeUp } from "@/components/animations/FadeUp";
import { Lightbox } from "@/components/shared/LazyLightbox";
import { Photo } from "@/components/shared/Photo";
import { roomLabel } from "@/data/rooms";
import { cn } from "@/lib/utils";
import type { Room } from "@/types";

const THUMBS = 3;

function StayCard({ room }: { room: Room }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const total = room.images.length;
  const thumbs = room.images.slice(0, THUMBS);
  const hidden = total - THUMBS;

  return (
    <article className="lift shadow-soft flex h-full flex-col rounded-[6px] border border-line bg-card p-3.5 text-body">
      <button
        type="button"
        onClick={() => setLightbox(active)}
        aria-label={`Open photo full size: ${room.images[active]?.alt ?? room.name}`}
        className="relative block aspect-[4/3] max-h-[200px] w-full cursor-zoom-in overflow-hidden rounded-[6px]"
      >
        <Photo
          key={room.images[active]?.src}
          image={room.images[active]}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 45vw, 100vw"
          imgClassName="animate-[fade-in_0.35s_ease-out]"
        />
      </button>

      {thumbs.length > 1 && (
        <ul className="mt-2 flex gap-2" aria-label={`${room.name} photos`}>
          {thumbs.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}: ${image.alt}`}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "relative block h-11 w-11 overflow-hidden rounded-[6px] border transition-opacity",
                  index === active
                    ? "border-burgundy"
                    : "border-line opacity-80 hover:opacity-100",
                )}
              >
                <Photo image={image} fill sizes="44px" />
              </button>
            </li>
          ))}
          {hidden > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setLightbox(THUMBS)}
                aria-label={`+${hidden}: show all ${total} photos`}
                className="label-mono grid h-11 w-11 place-items-center rounded-[6px] border border-burgundy text-[0.7rem] text-burgundy transition-colors hover:bg-burgundy hover:text-ivory"
              >
                +{hidden}
              </button>
            </li>
          )}
        </ul>
      )}

      <div className="flex flex-1 flex-col pt-3.5">
        <p className="label-mono text-[0.62rem] text-body">{roomLabel(room)}</p>
        <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight font-normal">
          {room.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-small text-body">{room.summary}</p>

        <p className="mt-3 text-small text-body/80">{room.highlights.join(" · ")}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
          <Link href={`/rooms/${room.slug}`} className="btn btn-primary !min-h-10 !px-4">
            View stay
          </Link>
          <Link
            href={`/booking?room=${room.slug}`}
            className="label-mono link-underline touch-target"
          >
            Enquire
          </Link>
        </div>
      </div>

      <Lightbox
        images={room.images}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </article>
  );
}

/** The four stays as small, equal-height cards. `home`: 4 columns from 1280px. `page`: 2 columns, max ~520px each. */
export function StayCards({
  rooms,
  variant = "home",
}: {
  rooms: Room[];
  variant?: "home" | "page";
}) {
  return (
    <ul
      className={cn(
        "grid gap-4",
        variant === "home" ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2",
      )}
    >
      {rooms.map((room, index) => (
        <li key={room.slug} className="w-full">
          <FadeUp index={index} className="h-full">
            <StayCard room={room} />
          </FadeUp>
        </li>
      ))}
    </ul>
  );
}
