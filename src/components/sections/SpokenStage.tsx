"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { m } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Bubble, TAIL_SIDES, type SpokenNote } from "@/components/sections/Bubble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const AUTO_MS = 8000;
const pad = (n: number) => String(n).padStart(2, "0");

// Wide screens show three bubbles; smaller screens show one. Server snapshot is "one" so markup matches.
const LG = "(min-width: 1024px)";
const subscribeLg = (onChange: () => void) => {
  const query = window.matchMedia(LG);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

// Vertical offsets of the three columns on wide screens, for a staggered, conversational rhythm.
const COLUMN_OFFSET = ["lg:mt-0", "lg:mt-14", "lg:mt-6"];
const BUBBLE_HEIGHT = "h-[22rem] sm:h-[19.5rem] lg:h-[19rem]";

/**
 * Home page guest notes: speech bubbles that swap through all the reviews. Fixed bubble sizes keep
 * the layout still when the text changes.
 */
export function SpokenStage({ notes }: { notes: SpokenNote[] }) {
  const reduced = useReducedMotion();
  const wide = useSyncExternalStore(
    subscribeLg,
    () => window.matchMedia(LG).matches,
    () => false,
  );
  const perView = wide ? 3 : 1;
  const total = notes.length;
  const [start, setStart] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hiddenTab, setHiddenTab] = useState(false);
  const swipeStart = useRef<number | null>(null);

  const go = useCallback(
    (direction: 1 | -1) => setStart((i) => (i + direction * perView + total * 3) % total),
    [perView, total],
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
  }, [start, paused, go]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  }

  const visible = Array.from({ length: perView }, (_, k) => notes[(start + k) % total]);
  const counter =
    perView === 1
      ? pad(start + 1)
      : `${pad(start + 1)}–${pad(((start + 2) % total) + 1)}`;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Guest notes"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return;
        const delta = e.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(delta) > 60) go(delta < 0 ? 1 : -1);
      }}
      className="touch-pan-y outline-offset-8 focus-visible:outline-2 focus-visible:outline-burgundy"
    >
      <div className="grid gap-5 lg:min-h-[29rem] lg:grid-cols-3 lg:gap-6">
        {visible.map((note, k) => (
          <m.div
            key={`${start}-${note.id}`}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: reduced ? 0 : k * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn("mx-auto w-full max-w-xl lg:max-w-none", COLUMN_OFFSET[k])}
          >
            <Bubble
              note={note}
              short
              tail={TAIL_SIDES[(start + k) % 3]}
              heightClass={BUBBLE_HEIGHT}
            />
          </m.div>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.map((n) => `${n.name}: ${n.excerpt ?? n.text}`).join(". ")}
      </p>

      <div
        className="mt-5 flex justify-center gap-2"
        role="group"
        aria-label="Choose notes"
      >
        {Array.from({ length: Math.ceil(total / perView) }, (_, page) => (
          <button
            key={page}
            type="button"
            onClick={() => setStart(page * perView)}
            aria-label={`Show notes ${page * perView + 1} onwards`}
            aria-current={Math.floor(start / perView) === page ? "true" : undefined}
            className="grid h-6 w-6 place-items-center"
          >
            <span
              className={`block h-2 w-2 rounded-full border border-burgundy ${
                Math.floor(start / perView) === page ? "bg-burgundy" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between sm:mt-8">
        <p className="font-display text-2xl text-body tabular-nums" aria-hidden="true">
          <span className="text-body">{counter}</span>
          <span className="text-body/60"> / {pad(total)}</span>
        </p>
        <div className="flex gap-3">
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir === "next" ? 1 : -1)}
              aria-label={dir === "next" ? "Next guest notes" : "Previous guest notes"}
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-body transition-colors hover:border-line hover:text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
            >
              {dir === "next" ? (
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
