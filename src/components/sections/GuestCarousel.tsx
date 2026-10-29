"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { SpokenNote } from "@/components/sections/Bubble";

const AUTO_MS = 8000;
const GAP = 20; // px between cards

// Cards in view: 3 from 1280px, 2 from 768px, otherwise 1. The server renders one so markup matches.
function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(min-width: 1280px)"),
    window.matchMedia("(min-width: 768px)"),
  ];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}
const snapshot = () =>
  window.matchMedia("(min-width: 1280px)").matches
    ? 3
    : window.matchMedia("(min-width: 768px)").matches
      ? 2
      : 1;

/**
 * Home page guest notes: a fixed-size row of equal cards that slides one card at a time.
 * Only the quote and the reviewer's name are shown.
 */
export function GuestCarousel({ notes }: { notes: SpokenNote[] }) {
  const reduced = useReducedMotion();
  const perView = useSyncExternalStore(subscribe, snapshot, () => 1);
  const total = notes.length;
  const last = Math.max(0, total - perView);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const swipeStart = useRef<number | null>(null);
  const at = Math.min(index, last);

  const go = useCallback(
    (step: number) =>
      setIndex((i) => {
        const next = Math.min(i, last) + step;
        return next > last ? 0 : next < 0 ? last : next;
      }),
    [last],
  );

  useEffect(() => {
    const onVisibility = () => setHiddenTab(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const paused = hovered || focused || hiddenTab || reduced;
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => go(1), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [at, paused, go]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  const visible = notes.slice(at, at + perView);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Guest notes"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="label-mono">Guest Notes</p>
          <h2 className="mt-2 font-display text-h3 leading-tight font-light">
            Words from our guests.
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <p className="font-display text-xl tabular-nums" aria-hidden="true">
            {at + 1} / {total}
          </p>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir === "next" ? 1 : -1)}
              aria-label={dir === "next" ? "Next guest note" : "Previous guest note"}
              className="grid h-10 w-10 place-items-center rounded-full border border-burgundy text-burgundy transition-colors hover:bg-burgundy hover:text-ivory"
            >
              {dir === "next" ? (
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-5 touch-pan-y overflow-hidden py-2"
        onPointerDown={(e) => (swipeStart.current = e.clientX)}
        onPointerUp={(e) => {
          if (swipeStart.current === null) return;
          const delta = e.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        }}
      >
        <ul
          className={cn(
            "flex",
            !reduced && "transition-transform duration-[450ms] ease-out",
          )}
          style={{
            gap: GAP,
            transform: `translateX(calc(${-at} * ((100% + ${GAP}px) / ${perView})))`,
          }}
        >
          {notes.map((note, i) => {
            const shown = i >= at && i < at + perView;
            return (
              <li
                key={note.id}
                aria-hidden={!shown}
                inert={!shown}
                className={cn(
                  "h-[200px] shrink-0 sm:h-[220px]",
                  !reduced && "transition-opacity duration-[450ms]",
                  shown ? "opacity-100" : "opacity-0",
                )}
                style={{
                  flexBasis: `calc((100% - ${GAP * (perView - 1)}px) / ${perView})`,
                }}
              >
                <figure className="shadow-soft m-0 flex h-full flex-col rounded-[6px] border border-line bg-card p-5 text-body">
                  <blockquote className="relative m-0 min-h-0 flex-1 overflow-hidden">
                    <p className="[display:-webkit-box] overflow-hidden font-display text-[1.1rem] leading-[1.5] italic [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
                      <span aria-hidden="true" className="mr-1 text-burgundy not-italic">
                        &ldquo;
                      </span>
                      {note.excerpt ?? note.text}
                    </p>
                  </blockquote>
                  <figcaption className="mt-3 flex items-center gap-3">
                    <span className="label-mono truncate tracking-[0.2em] uppercase">
                      {note.name}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.map((n) => `${n.name}: ${n.excerpt ?? n.text}`).join(". ")}
      </p>

      <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <span aria-hidden="true" className="hidden sm:block" />
        <div className="flex justify-center" role="group" aria-label="Choose notes">
          {Array.from({ length: last + 1 }, (_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => setIndex(page)}
              aria-label={`Show notes from number ${page + 1}`}
              aria-current={at === page ? "true" : undefined}
              className="grid h-6 w-4 place-items-center"
            >
              <span
                className={cn(
                  "block h-2 w-2 rounded-full border border-burgundy",
                  at === page ? "bg-burgundy" : "bg-transparent",
                )}
              />
            </button>
          ))}
        </div>
        <Link
          href="/testimonials"
          className="group link-underline inline-flex items-center gap-2 justify-self-center font-medium text-burgundy sm:justify-self-end"
        >
          Read all guest notes
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-[3px]"
          />
        </Link>
      </div>
    </div>
  );
}
