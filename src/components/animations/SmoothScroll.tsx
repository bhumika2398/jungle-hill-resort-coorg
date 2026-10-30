"use client";

import { useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { registerSmoothScroll } from "@/lib/smooth-scroll";

/** Space kept above an anchor target for the fixed header, in px. */
const ANCHOR_OFFSET = -88;

/**
 * Lenis smooth scrolling for mouse and trackpad users only. Touch devices keep native scrolling
 * (momentum, rubber-banding), and reduced motion turns it off; CSS smooth scrolling covers anchor
 * links in those cases. The library loads when the browser is idle, runs one shared animation
 * frame loop, and is destroyed on unmount. Modals call lockSmoothScroll() to pause it, and inner
 * scroll areas use data-lenis-prevent.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;
    const start = () => {
      void import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          autoRaf: true,
          lerp: 0.1,
          smoothWheel: true,
          anchors: { offset: ANCHOR_OFFSET, duration: 1.1 },
        });
        registerSmoothScroll(lenis);
        destroy = () => {
          registerSmoothScroll(null);
          lenis.destroy();
        };
      });
    };
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 800);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      destroy?.();
    };
  }, [reduced]);

  return <>{children}</>;
}
