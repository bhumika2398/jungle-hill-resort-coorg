"use client";

import { useEffect } from "react";
import { m } from "motion/react";
import { Bubble, TAIL_SIDES, type SpokenNote } from "@/components/sections/Bubble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// Vertical offsets of the three columns on desktop, for a staggered, conversational rhythm.
const COLUMN_OFFSET = ["lg:mt-0", "lg:mt-14", "lg:mt-6"];

/** Briefly outlines the note a deep link (#note-id) points at. */
function usePulseOnTarget() {
  useEffect(() => {
    let timer: number | undefined;
    const pulse = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith("note-")) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: "center" });
      el.classList.remove("note-pulse");
      void el.offsetWidth; // restart the animation
      el.classList.add("note-pulse");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("note-pulse"), 1800);
    };
    pulse();
    window.addEventListener("hashchange", pulse);
    return () => {
      window.removeEventListener("hashchange", pulse);
      window.clearTimeout(timer);
    };
  }, []);
}

/**
 * All the notes as speech bubbles in a staggered masonry: three columns on desktop, two on tablet,
 * one on mobile. The notes are dealt into three columns; below the desktop width the column wrappers
 * dissolve and CSS columns flow the bubbles instead.
 */
export function NotesWall({ notes }: { notes: SpokenNote[] }) {
  const reduced = useReducedMotion();
  usePulseOnTarget();

  const columns: { note: SpokenNote; index: number }[][] = [[], [], []];
  notes.forEach((note, index) => columns[index % 3].push({ note, index }));

  return (
    <div className="columns-1 gap-6 md:columns-2 md:gap-8 lg:flex lg:gap-8">
      {columns.map((column, c) => (
        <div
          key={c}
          className={cn(
            "contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-8",
            COLUMN_OFFSET[c],
          )}
        >
          {column.map(({ note, index }) => (
            <m.div
              key={note.id}
              data-reveal
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 break-inside-avoid lg:mb-0"
            >
              <Bubble
                note={note}
                tail={TAIL_SIDES[index % 3]}
                className="scroll-mt-28 rounded-[6px] outline-2 outline-transparent"
                id={`note-${note.id}`}
              />
            </m.div>
          ))}
        </div>
      ))}
    </div>
  );
}
