import { HoverLink as Link } from "@/components/shared/HoverLink";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FooterCredit } from "@/components/layout/FooterCredit";
import { Photo } from "@/components/shared/Photo";
import { siteConfig } from "@/config/site.config";
import { mainNav } from "@/data/navigation";
import { mailLink, telLink, whatsappLink } from "@/lib/contact";
import { photo } from "@/lib/images";

const backdrop = photo(
  "/images/gallery/grounds-misty-valley.jpg",
  "Mist over the valley beyond the resort's tiled roofs",
);

const nudge =
  "inline-flex items-center transition-[color,transform] duration-300 hover:translate-x-[3px] hover:text-burgundy";

/** Compact footer: small text wordmark, four columns, a soft real photo behind, a quiet credit. No rules. */
export function Footer() {
  const { contact } = siteConfig;
  const first = mainNav.slice(0, 6);
  const second = mainNav.slice(6);

  return (
    <footer className="theme-sand relative isolate overflow-hidden bg-surface text-body">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-2">
          <Photo image={backdrop} fill sizes="100vw" />
        </div>
        <div className="bg-surface/[0.9] absolute inset-0" />
      </div>

      <div className="page-container relative py-[clamp(1.5rem,3vw,2.25rem)] pr-[4.25rem] lg:pr-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.3fr_1fr] lg:gap-6">
          <div>
            <p className="font-display text-[1.7rem] leading-none font-normal">
              Jungle Hill
            </p>
            <p className="label-mono mt-2">Inspiring Cloudline</p>
            <p className="mt-3 max-w-[30ch] text-small">
              A coffee and pepper estate retreat, 5 km from Madikeri.
            </p>
          </div>

          <div>
            <h2 className="label-mono">Visit</h2>
            <address className="mt-3 text-small not-italic">
              <MapPin
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
                className="mr-2 inline-block align-[-3px]"
              />
              Mekeri Village, Madikeri
              <br />
              <span className="pl-6">Coorg, Karnataka 571201</span>
            </address>
            <ul className="mt-3 space-y-1 text-small">
              <li>
                <a href={telLink} className={`touch-target ${nudge} gap-2`}>
                  <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
                  Call {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`touch-target ${nudge} gap-2`}
                >
                  <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />
                  WhatsApp {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={mailLink} className={`touch-target ${nudge} gap-2 break-all`}>
                  <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="label-mono">Explore</h2>
            <div className="mt-3 grid grid-cols-2 gap-x-6 text-small">
              <ul className="space-y-1">
                {first.map((item) => (
                  <li key={item.href}>
                    <Link
                      prefetch={false}
                      href={item.href}
                      className={`touch-target ${nudge}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {second.map((item) => (
                  <li key={item.href}>
                    <Link
                      prefetch={false}
                      href={item.href}
                      className={`touch-target ${nudge}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    prefetch={false}
                    href="/booking"
                    className={`touch-target ${nudge}`}
                  >
                    Enquire / Book
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="label-mono">Stay notes</h2>
            <ul className="mt-3 space-y-1 text-small">
              <li>Check-in 12 PM · Check-out 11 AM</li>
              <li>ID proof mandatory</li>
              <li>No visitors after 8:30 PM</li>
              <li>No loud music or sounds after 10:00 PM</li>
            </ul>
          </div>
        </div>

        <FooterCredit />
      </div>
    </footer>
  );
}
