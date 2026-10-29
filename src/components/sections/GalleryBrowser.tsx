"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Lightbox } from "@/components/shared/LazyLightbox";
import { Photo } from "@/components/shared/Photo";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryImage } from "@/types";

interface GalleryBrowserProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
}

/** Slides this far from the centre are rendered; the rest are not mounted. */
const VISIBLE_RANGE = 3;

/**
 * 3D cover-flow gallery: the current photo stands forward, its neighbours turn away on either
 * side. Category filters, arrows, swipe, keyboard, a thumbnail rail and a full-size lightbox.
 * Every photo in the category is reachable.
 */
export function GalleryBrowser({ images, categories }: GalleryBrowserProps) {
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const rail = useRef<HTMLUListElement>(null);
  const press = useRef<number | null>(null);
  const moved = useRef(false);

  const visible =
    category === "All" ? images : images.filter((image) => image.category === category);
  const count = visible.length;
  const current = visible[index];

  const go = (next: number) => setIndex(((next % count) + count) % count);

  // Keep the active thumbnail centred in the rail without scrolling the page.
  useEffect(() => {
    const list = rail.current;
    const thumb = list?.children[index] as HTMLElement | undefined;
    if (!list || !thumb) return;
    list.scrollTo({
      left: thumb.offsetLeft - list.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: "smooth",
    });
  }, [index, category]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "Enter") {
      setOpen(index);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    press.current = event.clientX;
    moved.current = false;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (press.current === null) return;
    const dx = event.clientX - press.current;
    press.current = null;
    if (Math.abs(dx) > 40) {
      moved.current = true;
      go(index + (dx < 0 ? 1 : -1));
    }
  }

  if (!current) return null;

  return (
    <div className="dark-surface">
      <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => {
              setCategory(item);
              setIndex(0);
              setOpen(null);
            }}
            className={cn(
              "label-mono min-h-10 rounded-full border px-4 transition-colors",
              category === item
                ? "border-ivory bg-ivory text-burgundy"
                : "border-ivory/40 text-ivory hover:border-ivory",
            )}
          >
            {item}
          </button>
        ))}
        <p className="label-mono ml-auto self-center text-ivory/80" aria-live="polite">
          {count} photos
        </p>
      </div>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Photographs"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative mt-6 h-[clamp(25rem,62vh,36rem)] touch-pan-y overflow-hidden select-none [--cw:clamp(11.5rem,52vw,18.5rem)] [--step:calc(var(--cw)*0.8)] [perspective:1400px] focus-visible:outline-2"
      >
        {visible.map((image, i) => {
          let d = i - index;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          const distance = Math.abs(d);
          if (distance > VISIBLE_RANGE) return null;
          const centre = d === 0;
          return (
            <div
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!centre}
              className="absolute top-1/2 left-1/2 aspect-[3/4] w-[var(--cw)] transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                transform: `translate(-50%, -50%) translateX(calc(var(--step) * ${d})) translateZ(${-distance * 150}px) rotateY(${-d * 26}deg) scale(${centre ? 1.12 : 1 - distance * 0.06})`,
                opacity: distance === VISIBLE_RANGE ? 0 : 1 - distance * 0.2,
                zIndex: 10 - distance,
              }}
            >
              <button
                type="button"
                tabIndex={centre ? 0 : -1}
                onClick={() => {
                  if (moved.current) return;
                  if (centre) setOpen(i);
                  else go(i);
                }}
                aria-label={
                  centre
                    ? `Open photo full size: ${image.alt}`
                    : `Show photo: ${image.alt}`
                }
                className="relative block h-full w-full overflow-hidden rounded-[6px] bg-burgundy shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              >
                <Photo
                  image={image}
                  fill
                  sizes="(min-width: 640px) 300px, 52vw"
                  priority={centre}
                />
                {centre && (
                  <span className="label-mono absolute top-3 right-3 rounded-[4px] border border-ivory/60 bg-burgundy/60 px-2.5 py-1 text-[0.6rem] text-ivory backdrop-blur-sm">
                    {image.category}
                  </span>
                )}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
          className="absolute top-1/2 left-1 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-ivory transition-colors hover:bg-ivory/15 sm:left-3"
        >
          <ChevronLeft size={28} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next photo"
          className="absolute top-1/2 right-1 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-ivory transition-colors hover:bg-ivory/15 sm:right-3"
        >
          <ChevronRight size={28} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mx-auto mt-5 max-w-2xl text-center" aria-live="polite">
        <p className="font-display text-2xl leading-snug text-ivory sm:text-3xl">
          {current.alt}
        </p>
        <p className="label-mono mt-3 text-ivory/70">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </p>
      </div>

      <ul
        ref={rail}
        aria-label="All photographs"
        className="mt-6 flex [scrollbar-width:none] gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
      >
        {visible.map((image, i) => (
          <li key={image.src} className="shrink-0">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}: ${image.alt}`}
              aria-current={i === index}
              className={cn(
                "relative block h-12 w-[4.5rem] overflow-hidden rounded-[4px] transition-opacity",
                i === index
                  ? "opacity-100 ring-2 ring-ivory"
                  : "opacity-50 hover:opacity-90",
              )}
            >
              <Photo image={image} fill sizes="72px" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={visible}
        index={open}
        onClose={() => setOpen(null)}
        onIndexChange={(next) => {
          setOpen(next);
          setIndex(next);
        }}
      />
    </div>
  );
}
