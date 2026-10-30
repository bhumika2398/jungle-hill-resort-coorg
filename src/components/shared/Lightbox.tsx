"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { GradeTint } from "@/components/shared/GradeTint";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface LightboxProps {
  images: ImageAsset[];
  /** Index of the open image, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** "black": a near-black backdrop and caption, used by the gallery. */
  variant?: "default" | "black";
}

/** Accessible lightbox: Esc, arrow keys, swipe, focus trap, focus restored on close. */
export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
  variant = "default",
}: LightboxProps) {
  const open = index !== null;
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    const total = images.length;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onIndexChange((index + 1) % total);
      else if (event.key === "ArrowLeft") onIndexChange((index - 1 + total) % total);
      else if (event.key === "Tab") {
        const focusable = panel.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndexChange]);

  if (index === null || !images[index]) return null;
  const image = images[index];
  const total = images.length;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-lenis-prevent
      className={cn(
        "dark-surface fixed inset-0 z-[80] touch-pan-y touch-pinch-zoom overscroll-contain text-ivory",
        variant === "black" ? "bg-black/[0.92]" : "bg-ink/95",
      )}
      onPointerDown={(event) => {
        swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return;
        const delta = event.clientX - swipeStart.current;
        swipeStart.current = null;
        if (Math.abs(delta) > 60)
          onIndexChange((index + (delta < 0 ? 1 : -1) + total) % total);
      }}
    >
      <div className="absolute inset-x-4 top-4 bottom-28 sm:inset-x-20 sm:top-6">
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="grade-filter object-contain"
          priority
        />
        <GradeTint />
      </div>

      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="btn btn-outline absolute top-3 right-3 h-11 w-11 p-0"
      >
        <X size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => onIndexChange((index - 1 + total) % total)}
            aria-label="Previous photo"
            className="btn btn-outline absolute top-1/2 left-3 h-11 w-11 -translate-y-1/2 p-0"
          >
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onIndexChange((index + 1) % total)}
            aria-label="Next photo"
            className="btn btn-outline absolute top-1/2 right-3 h-11 w-11 -translate-y-1/2 p-0"
          >
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}

      <p
        aria-live="polite"
        className={cn(
          "absolute inset-x-4 bottom-4 mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-[6px] border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm backdrop-blur-[12px] sm:bottom-6",
          variant === "black"
            ? "border-white/15 bg-black/45 text-ivory"
            : "border-ivory/25 bg-ivory/10 text-ivory",
        )}
      >
        <span>{image.alt}</span>
        <span className="label-mono shrink-0">
          {index + 1} / {total}
        </span>
      </p>
    </div>
  );
}
