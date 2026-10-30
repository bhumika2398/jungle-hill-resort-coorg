"use client";

import { useEffect, useRef, useState } from "react";
import { HoverLink as Link } from "@/components/shared/HoverLink";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { telLink, whatsappLink } from "@/lib/contact";
import { lockSmoothScroll } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface MobileMenuProps {
  items: NavItem[];
  /** True when the header sits over a dark background. */
  light?: boolean;
}

export function MobileMenu({ items, light = true }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const firstLink = useRef<HTMLAnchorElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Close whenever the route changes (link taps, back/forward).
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const unlock = lockSmoothScroll();
    firstLink.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep focus inside the menu: the panel's links plus the Close button.
      const items = [
        toggle.current,
        ...(panel.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []),
      ].filter((el): el is HTMLElement => !!el);
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "label-mono relative z-[60] min-h-11 px-2",
          open ? "text-body" : light ? "text-body" : "text-body",
        )}
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="glass fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-ivory/90 px-[var(--spacing-gutter)] pt-24 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-body backdrop-blur-xl"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <li key={item.href}>
                  <Link
                    ref={index === 0 ? firstLink : undefined}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4 font-display text-3xl text-body"
                  >
                    <span className="label-mono w-6 text-body">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="btn btn-primary"
            >
              Enquire about a stay
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <a href={telLink} className="btn btn-outline-light gap-2">
                <Phone size={16} strokeWidth={1.5} aria-hidden="true" /> Call
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-light gap-2"
              >
                <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> WhatsApp
              </a>
            </div>
            <a href={telLink} className="label-mono pt-4 text-body">
              {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
