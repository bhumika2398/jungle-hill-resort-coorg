"use client";

import { useEffect } from "react";
import { m } from "motion/react";
import { Bubble, TAIL_SIDES, type SpokenNote } from "@/components/sections/Bubble";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
 * All the notes as speech bubbles in an even grid of equal-height cards: three columns on desktop,
 * two on tablet, one on mobile.
 */
export function NotesWall({ notes }: { notes: SpokenNote[] }) {
  const reduced = useReducedMotion();
  usePulseOnTarget();

  return (
    <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note, index) => (
        <m.div
          key={note.id}
          data-reveal
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <Bubble
            note={note}
            tail={TAIL_SIDES[index % 3]}
            className="flex h-full scroll-mt-28 flex-col rounded-[6px] outline-2 outline-transparent"
            heightClass="flex-1"
            id={`note-${note.id}`}
          />
        </m.div>
      ))}
    </div>
  );
}
