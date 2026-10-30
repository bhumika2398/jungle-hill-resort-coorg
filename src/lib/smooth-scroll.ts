import type Lenis from "lenis";

let instance: Lenis | null = null;
let locks = 0;

/** Called by SmoothScroll when Lenis starts (and with null when it is destroyed). */
export function registerSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
  if (lenis && locks > 0) lenis.stop();
}

/**
 * Stops smooth scrolling while a modal, the photo viewer or the mobile menu is open, so it never
 * fights the page lock or an inner scroll area. Returns the function that releases the lock.
 */
export function lockSmoothScroll() {
  locks += 1;
  instance?.stop();
  return () => {
    locks = Math.max(0, locks - 1);
    if (locks === 0) instance?.start();
  };
}
