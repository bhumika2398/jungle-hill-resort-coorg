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
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { GalleryCategory, GalleryImage } from "@/types";

interface GalleryBrowserProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
}

/** Cards further than this from the centre are not mounted. */
const RANGE = 3;
const AUTOPLAY_MS = 6000;

/** Horizontal offset from the centre card, in card widths, by distance: the row curves inwards. */
const OFFSET = [0, 0.78, 1.38, 1.8];
const SCALE = [1.08, 0.82, 0.7, 0.6];
/** Black dimming over the cards beside the centre; the outermost card is hidden. */
const DIM = [0, 0.35, 0.55, 0.55];
const FADE = [1, 1, 1, 0];

const arrow =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ivory/70 text-ivory transition-colors hover:border-burgundy hover:bg-burgundy";

/**
 * Curved 3D gallery: the current photo stands upright in the centre, the cards beside it turn
 * back and shrink. Filters, arrows, swipe, keyboard, slow autoplay, a thumbnail strip and the
 * full-size lightbox. Every photo in the chosen category is reachable.
 */
export function GalleryBrowser({ images, categories }: GalleryBrowserProps) {
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<GalleryCategory | "All">("All");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [hidden, setHidden] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLUListElement>(null);
  const press = useRef<number | null>(null);
  const moved = useRef(false);

  const visible =
    category === "All" ? images : images.filter((image) => image.category === category);
  const count = visible.length;
  const current = visible[index];
  const go = (next: number) => setIndex(((next % count) + count) % count);

  // Slow autoplay: off for reduced motion, and paused on hover, focus, an open lightbox, a
  // hidden tab or when the carousel is off-screen.
  useEffect(() => {
    if (reduced || paused || hidden || !onScreen || open !== null || count < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [reduced, paused, hidden, onScreen, open, count]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keep the active thumbnail in view inside the strip, without scrolling the page.
  useEffect(() => {
    const list = rail.current;
    const thumb = list?.children[index] as HTMLElement | undefined;
    if (!list || !thumb) return;
    list.scrollTo({
      left: thumb.offsetLeft - list.clientWidth / 2 + thumb.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [index, category, reduced]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
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
    <div className="text-ivory">
      <div
        role="group"
        aria-label="Filter photos"
        className="-mx-[var(--spacing-gutter)] flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-[var(--spacing-gutter)] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
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
              "label-mono min-h-9 shrink-0 rounded-full px-3 transition-colors",
              category === item
                ? "bg-burgundy text-ivory"
                : "text-ivory/70 hover:text-ivory",
            )}
          >
            {item}
          </button>
        ))}
        <p
          className="label-mono ml-auto hidden shrink-0 self-center text-ivory/80 sm:block"
          aria-live="polite"
        >
          {count} photos
        </p>
      </div>

      <div
        ref={stage}
        role="group"
        aria-roledescription="carousel"
        aria-label="Photographs"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative mt-4 h-[clamp(26rem,56vh,32rem)] touch-pan-y overflow-hidden select-none [--cw:clamp(13rem,64vw,19rem)] [perspective:1200px] focus-visible:outline-2"
      >
        {visible.map((image, i) => {
          let d = i - index;
          if (d > count / 2) d -= count;
          if (d < -count / 2) d += count;
          const distance = Math.abs(d);
          if (distance > RANGE) return null;
          const centre = d === 0;
          const sign = d < 0 ? -1 : 1;

          const style = reduced
            ? {
                transform: "translate(-50%, -50%)",
                opacity: centre ? 1 : 0,
                pointerEvents: centre ? ("auto" as const) : ("none" as const),
                zIndex: 10 - distance,
              }
            : {
                transform: `translate(-50%, -50%) translateX(calc(var(--cw) * ${OFFSET[distance] * sign})) translateZ(${-distance * 120}px) rotateY(${-sign * (distance === 0 ? 0 : 18 + distance * 3)}deg) scale(${SCALE[distance]})`,
                opacity: FADE[distance],
                zIndex: 10 - distance,
              };

          return (
            <div
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!centre}
              className="absolute top-1/2 left-1/2 aspect-[3/4] w-[var(--cw)] transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={style}
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
                className="group relative block h-full w-full overflow-hidden rounded-[6px] border border-white/15 bg-black shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
              >
                <Photo
                  image={image}
                  fill
                  sizes="(min-width: 640px) 304px, 64vw"
                  priority={centre}
                  imgClassName={cn(
                    "transition-transform duration-500",
                    centre && "group-hover:scale-[1.03]",
                  )}
                />
                {!centre && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-[550ms]"
                    style={{ opacity: DIM[distance] }}
                  />
                )}
                {centre && (
                  <>
                    <span className="label-mono absolute top-3 right-3 rounded-[4px] border border-white/15 bg-black/45 px-2.5 py-1 text-[0.6rem] text-ivory backdrop-blur-[12px]">
                      {image.category}
                    </span>
                    <span className="absolute inset-x-2 bottom-2 rounded-[6px] border border-white/15 bg-black/45 p-3 text-left text-ivory backdrop-blur-[12px]">
                      <span className="block font-display text-xl leading-tight">
                        {image.title ?? image.category}
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-1.5 block h-px w-8 bg-ivory"
                      />
                      <span className="mt-1.5 line-clamp-2 block text-small">
                        {image.alt}
                      </span>
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
          className={cn(
            arrow,
            "absolute top-1/2 left-[7%] z-20 hidden -translate-y-1/2 sm:grid",
          )}
        >
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next photo"
          className={cn(
            arrow,
            "absolute top-1/2 right-[7%] z-20 hidden -translate-y-1/2 sm:grid",
          )}
        >
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4" aria-live="polite">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous photo"
          className={cn(arrow, "sm:hidden")}
        >
          <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <p className="font-display text-2xl tabular-nums">
          {String(index + 1).padStart(2, "0")}
          <span className="text-ivory/60"> / {String(count).padStart(2, "0")}</span>
        </p>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next photo"
          className={cn(arrow, "sm:hidden")}
        >
          <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <ul
        ref={rail}
        aria-label="All photographs"
        className="mt-4 hidden [scrollbar-width:none] gap-2 overflow-x-auto pb-2 sm:flex [&::-webkit-scrollbar]:hidden"
      >
        {visible.map((image, i) => (
          <li key={image.src} className="shrink-0">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}: ${image.alt}`}
              aria-current={i === index}
              className={cn(
                "relative block h-14 w-14 overflow-hidden rounded-[4px] border transition-opacity",
                i === index
                  ? "border-ivory opacity-100 ring-2 ring-ivory"
                  : "border-white/15 opacity-60 hover:opacity-100",
              )}
            >
              <Photo image={image} fill sizes="56px" />
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        variant="black"
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
