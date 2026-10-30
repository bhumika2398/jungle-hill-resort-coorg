"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { defaultEnquiryMessage, whatsappLink } from "@/lib/contact";
import { useIntroReady } from "@/lib/intro-store";
import { cn } from "@/lib/utils";

interface FloatingContactProps {
  message?: string;
}

const FALLBACK_MS = 3000;
const STAGGER_MS = 100;

const pill =
  "floating-pill inline-flex items-center justify-center border border-burgundy bg-burgundy text-ivory shadow-[0_8px_24px_rgba(100,28,43,0.18)] transition-[background-color,border-color] duration-200 hover:border-[color-mix(in_srgb,var(--color-burgundy)_85%,black)] hover:bg-[color-mix(in_srgb,var(--color-burgundy)_85%,black)] focus-visible:shadow-[0_0_0_2px_var(--color-ivory)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-burgundy";
const round = "h-11 w-11 rounded-full";

/**
 * Floating Call and WhatsApp icon buttons, stacked bottom right. They pop up in sequence as soon
 * as the landing experience has finished (preloader dismissed or skipped, or never shown), with a
 * 3 s fallback, and then stay on every page. They hide only while the footer is on screen.
 */
export function WhatsAppButton({
  message = defaultEnquiryMessage,
}: FloatingContactProps) {
  const introDone = useIntroReady();
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);
  const [settled, setSettled] = useState(false);
  const [overFooter, setOverFooter] = useState(false);

  // Always appear, even if the intro signal never arrives.
  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, []);

  const shown = introDone || fallback;

  // After the first reveal, later show/hide (footer) happens without the stagger delay.
  useEffect(() => {
    if (!shown) return;
    const id = window.setTimeout(() => setSettled(true), 900);
    return () => window.clearTimeout(id);
  }, [shown]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOverFooter(entry.isIntersecting),
      {
        threshold: 0,
      },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = shown && !overFooter;
  const tabIndex = visible ? 0 : -1;

  const motionStyle = (index: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : "translateY(16px) scale(0.92)",
    transition: reduced
      ? "none"
      : "opacity 500ms ease-out, transform 500ms ease-out, border-color 300ms, background-color 300ms",
    transitionDelay: reduced || settled ? "0ms" : `${index * STAGGER_MS}ms`,
    pointerEvents: visible ? "auto" : "none",
  });

  return (
    <div
      className="floating-contact pointer-events-none fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-[91] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
      aria-hidden={visible ? undefined : true}
    >
      <a
        href={`tel:${siteConfig.floatingContact.phoneTel}`}
        tabIndex={tabIndex}
        style={motionStyle(0)}
        aria-label="Call Jungle Hill Resort"
        className={cn(pill, round)}
      >
        <Phone size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
      <a
        href={whatsappLink(message, siteConfig.floatingContact.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={tabIndex}
        style={motionStyle(1)}
        aria-label="Chat on WhatsApp"
        className={cn(pill, round)}
      >
        <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
