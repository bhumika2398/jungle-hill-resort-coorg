"use client";

import { HoverLink as Link } from "@/components/shared/HoverLink";
import { useState, useSyncExternalStore } from "react";
import { COOKIE_NOTICE_KEY } from "@/lib/legal";

/**
 * Small dismissible notice. The site sets no advertising or analytics cookies, so this informs rather
 * than asks. The choice is remembered in localStorage; if storage is blocked the notice simply shows
 * again next time.
 */
const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
};

/** True once the notice was dismissed. Blocked storage counts as "not dismissed". */
const readDismissed = () => {
  try {
    return window.localStorage.getItem(COOKIE_NOTICE_KEY) === "1";
  } catch {
    return false;
  }
};

export function CookieNotice() {
  // The server renders it hidden, so there is no flash for visitors who already dismissed it.
  const dismissedBefore = useSyncExternalStore(subscribe, readDismissed, () => true);
  const [closed, setClosed] = useState(false);

  if (dismissedBefore || closed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(COOKIE_NOTICE_KEY, "1");
    } catch {
      // Storage blocked: the notice will show again next visit.
    }
    setClosed(true);
  };

  return (
    <section
      aria-label="Cookie notice"
      className="theme-sand shadow-soft fixed right-[4.75rem] bottom-4 left-4 z-[60] max-w-md rounded-[6px] border border-line bg-surface p-4 text-body sm:right-auto sm:bottom-6 sm:left-6"
    >
      <p className="text-small">
        We use only the minimum browser storage to run this site, with no advertising or
        analytics cookies.{" "}
        <Link
          href="/cookie-policy"
          className="underline decoration-burgundy underline-offset-4"
        >
          Cookie policy
        </Link>
        {" · "}
        <Link
          href="/privacy-policy"
          className="underline decoration-burgundy underline-offset-4"
        >
          Privacy policy
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="btn btn-outline mt-3 min-h-10 px-4 py-1.5 text-small"
      >
        Got it
      </button>
    </section>
  );
}
