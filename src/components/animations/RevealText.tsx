"use client";

import type { CSSProperties } from "react";
import { m } from "motion/react";
import { easeOut } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface HeadingLine {
  text?: string;
  /** Rendered in italic with the brass accent. */
  emphasis?: string;
  /** Plain text after the emphasised word. */
  after?: string;
}

interface RevealTextProps {
  /** One entry per visual line; each line is masked and slides up. Plain data, so it serialises. */
  lines: HeadingLine[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** Animate on load (after the intro) instead of when scrolled into view. */
  immediate?: boolean;
  /** True on dark backgrounds: the emphasis uses the lighter brass. */
  onDark?: boolean;
}

export function RevealText({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  immediate = false,
}: RevealTextProps) {
  const reduced = useReducedMotion();

  const trigger = {
    whileInView: { y: "0%" },
    viewport: { once: true, margin: "-10% 0px" },
  };

  const content = (line: HeadingLine) => (
    <>
      {line.text}
      {line.emphasis}
      {line.after}
    </>
  );

  // Above-the-fold headings are pure CSS: visible in the server HTML, animated on first paint.
  if (immediate) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <span key={index} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span
              className="hero-line block"
              style={{ "--d": `${delay + index * 0.09}s` } as CSSProperties}
            >
              {content(line)}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={index} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          <m.span
            data-reveal
            className="block"
            initial={reduced ? false : { y: "110%" }}
            transition={{ duration: 0.8, ease: easeOut, delay: delay + index * 0.09 }}
            {...trigger}
          >
            {line.text}
            {line.emphasis}
            {line.after}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
