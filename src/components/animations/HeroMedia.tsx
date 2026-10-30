"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import { GradeTint } from "@/components/shared/GradeTint";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ResolvedHeroSlide } from "@/data/hero";
import { cn } from "@/lib/utils";

const FADE_MS = 800;
const NOT_READY_MS = 600; // a video that is not buffered when its turn comes is skipped quickly

type NetworkInfo = { connection?: { saveData?: boolean; effectiveType?: string } };

const noopSubscribe = () => () => {};

/** Video is skipped on Save-Data and slow connections. Server snapshot is false so markup matches. */
function videoAllowed() {
  const connection = (navigator as Navigator & NetworkInfo).connection;
  if (connection?.saveData) return false;
  if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return false;
  if (connection?.effectiveType && /(^|-)(2g|3g)$/.test(connection.effectiveType))
    return false;
  // The video is a desktop nicety: phones and small tablets keep the photos only.
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  return true;
}

/**
 * Hero background: a slow sequence of two photos and a video, with 0.8 s crossfades and a
 * gentle Ken Burns zoom on the photos. Reduced motion shows the first photo only.
 */
export function HeroMedia({ slides }: { slides: ResolvedHeroSlide[] }) {
  const reduced = useReducedMotion();
  const canPlayVideo = useSyncExternalStore(noopSubscribe, videoAllowed, () => false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 160]);

  const playable = slides.filter((slide) => slide.type === "image" || canPlayVideo);
  const total = playable.length;

  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [furthest, setFurthest] = useState(0);
  const [paused, setPaused] = useState(false);
  const videos = useRef<Record<number, HTMLVideoElement | null>>({});
  const videoFailed = useRef(false);

  const goTo = useCallback(
    (next: number) => {
      if (total < 2) return;
      const target = ((next % total) + total) % total;
      setIndex((current) => {
        if (current === target) return current;
        setPrevious(current);
        return target;
      });
      setFurthest((value) => Math.max(value, Math.min(total - 1, target + 1)));
    },
    [total],
  );

  // The second photo is preloaded once the first has loaded (onLoad below), or when the browser is idle.
  const preloadNext = useCallback(() => setFurthest((value) => Math.max(value, 1)), []);
  useEffect(() => {
    if (reduced || total < 2) return;
    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle
      ? window.requestIdleCallback(preloadNext, { timeout: 2500 })
      : window.setTimeout(preloadNext, 2000);
    return () => {
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [reduced, total, preloadNext]);

  // The video starts buffering when the second photo becomes active, so it is ready for its own slide.
  useEffect(() => {
    playable.forEach((slide, i) => {
      if (slide.type === "video" && i === index + 1) {
        const video = videos.current[i];
        if (video) video.preload = "auto";
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, furthest, canPlayVideo]);

  // Advance after each slide's duration (a video that is not ready is skipped after 0.6 s).
  useEffect(() => {
    if (reduced || paused || total < 2) return;
    const slide = playable[index];
    if (!slide) return;
    const video = videos.current[index];
    const unready =
      slide.type === "video" && (videoFailed.current || !video || video.readyState < 2);
    const wait = unready ? NOT_READY_MS : slide.duration;
    const id = window.setTimeout(() => goTo(index + 1), wait);
    return () => window.clearTimeout(id);
    // playable is derived from stable props and canPlayVideo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, reduced, total, goTo, canPlayVideo]);

  // The outgoing slide stays opaque underneath until the incoming one has fully faded in.
  useEffect(() => {
    if (previous === null) return;
    const id = window.setTimeout(() => setPrevious(null), FADE_MS + 100);
    return () => window.clearTimeout(id);
  }, [previous]);

  // Play the video only while its slide is active; pause and rewind it once hidden.
  useEffect(() => {
    playable.forEach((slide, i) => {
      if (slide.type !== "video") return;
      const video = videos.current[i];
      if (!video) return;
      if (i === index && !paused && !reduced) {
        void video.play().catch(() => {
          videoFailed.current = true;
        });
      } else if (i === index) {
        video.pause();
      } else if (i !== previous) {
        video.pause();
        video.currentTime = 0;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, previous, paused, reduced, furthest, canPlayVideo]);

  // Tell the preloader the first photo is in, and start preloading the next slide.
  const onFirstPhotoLoaded = useCallback(() => {
    (window as Window & { __heroReady?: boolean }).__heroReady = true;
    window.dispatchEvent(new Event("jhr-hero-ready"));
    preloadNext();
  }, [preloadNext]);

  // The first photo may already have finished loading before React attached onLoad.
  useEffect(() => {
    const first = document.querySelector<HTMLImageElement>(
      "section[aria-label=Welcome] img",
    );
    if (first && first.complete && first.naturalWidth > 0) {
      (window as Window & { __heroReady?: boolean }).__heroReady = true;
      window.dispatchEvent(new Event("jhr-hero-ready"));
      const id = window.setTimeout(preloadNext, 0);
      return () => window.clearTimeout(id);
    }
  }, [preloadNext]);

  const visibleSlides = reduced ? playable.slice(0, 1) : playable;

  return (
    <>
      <m.div
        className="pointer-events-none absolute inset-x-0 -top-10 -bottom-10 isolate z-0"
        style={reduced ? undefined : { y }}
      >
        {visibleSlides.map((slide, i) => {
          if (i > furthest && i !== 0) return null;
          const active = i === index;
          const showing = active || i === previous;
          return (
            <div
              key={slide.src + i}
              className={cn(
                "absolute inset-0",
                "transition-opacity ease-in-out",
                showing ? "opacity-100" : "opacity-0",
                active ? "z-10" : "z-0",
              )}
              style={{ transitionDuration: reduced ? "0ms" : `${FADE_MS}ms` }}
            >
              {slide.type === "image" ? (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  quality={70}
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  onLoad={i === 0 ? onFirstPhotoLoaded : undefined}
                  placeholder={slide.blurDataURL ? "blur" : "empty"}
                  blurDataURL={slide.blurDataURL}
                  className={cn("object-cover", showing && !reduced && "hero-kb")}
                  style={{ objectPosition: slide.objectPosition }}
                />
              ) : (
                <video
                  ref={(node) => {
                    videos.current[i] = node;
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: slide.objectPosition }}
                  muted
                  playsInline
                  preload="metadata"
                  poster={slide.poster}
                  aria-hidden="true"
                  tabIndex={-1}
                  onEnded={() => active && goTo(index + 1)}
                  onError={() => {
                    videoFailed.current = true;
                  }}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              )}
              <GradeTint />
            </div>
          );
        })}
      </m.div>

      {!reduced && total > 1 && (
        <div className="absolute inset-x-0 bottom-5 z-20">
          <div className="page-container">
            <div
              role="group"
              aria-label="Hero slides"
              className="flex w-full items-center justify-end gap-3"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                  setPaused(false);
              }}
            >
              <span
                className="label-mono mr-1 text-[0.7rem] text-ivory"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
              </span>
              {(["prev", "next"] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => goTo(index + (dir === "next" ? 1 : -1))}
                  aria-label={dir === "next" ? "Next slide" : "Previous slide"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ivory/70 text-ivory transition-colors hover:bg-ivory hover:text-ink"
                >
                  {dir === "next" ? (
                    <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <ChevronLeft size={18} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
