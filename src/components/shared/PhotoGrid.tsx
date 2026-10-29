"use client";

import { useState } from "react";
import { Lightbox } from "@/components/shared/LazyLightbox";
import { Photo } from "@/components/shared/Photo";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface PhotoGridProps {
  images: ImageAsset[];
  /** Aspect ratio class for the wide first photo. */
  mainRatio?: string;
}

/** Thumbnail columns that fill every row evenly: 6 thumbs in 3 columns, 4 in 4, 2 in 2. */
function thumbColumns(count: number): string {
  if (count > 4 && count % 3 === 0) return "grid-cols-3";
  if (count === 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-3";
  return "grid-cols-2 sm:grid-cols-4";
}

/** One wide photo on top, then evenly sized thumbnails. Every photo opens in the lightbox. */
export function PhotoGrid({ images, mainRatio = "aspect-[16/9]" }: PhotoGridProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [first, ...rest] = images;
  if (!first) return null;

  const tile = (image: ImageAsset, index: number, ratio: string, sizes: string) => (
    <button
      type="button"
      onClick={() => setOpen(index)}
      aria-label={`Open photo: ${image.alt}`}
      className={cn("group relative block w-full overflow-hidden rounded-[6px]", ratio)}
    >
      <Photo
        image={image}
        fill
        sizes={sizes}
        imgClassName="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
      />
    </button>
  );

  return (
    <>
      <div className="space-y-2.5 sm:space-y-3">
        {tile(first, 0, mainRatio, "(min-width: 1024px) 60vw, 100vw")}
        {rest.length > 0 && (
          <ul className={cn("grid gap-2.5 sm:gap-3", thumbColumns(rest.length))}>
            {rest.map((image, index) => (
              <li key={image.src}>
                {tile(image, index + 1, "aspect-[4/3]", "(min-width: 1024px) 20vw, 33vw")}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Lightbox
        images={images}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={setOpen}
      />
    </>
  );
}
