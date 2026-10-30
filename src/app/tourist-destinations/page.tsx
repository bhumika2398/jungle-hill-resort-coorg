import Link from "next/link";
import { BedDouble, MapPin, MessageCircle, Utensils, Waves } from "lucide-react";
import { DestinationBrowser } from "@/components/sections/DestinationBrowser";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { destinations, destinationsIntro, destinationsNote } from "@/data/destinations";
import { whatsappLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, destinationsJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Tourist Destinations near Jungle Hill Resort, Coorg",
  description:
    "Places to visit near Jungle Hill Resort in Coorg: Raja's Seat, Madikeri Fort, Abbey Falls, Dubare, Talacauvery and more, grouped by distance from the resort.",
  path: "/tourist-destinations",
});

const trust = [
  { icon: MapPin, text: "5 km from Madikeri" },
  { icon: BedDouble, text: "13 rooms" },
  { icon: Utensils, text: "Restaurant 7 AM to 10 PM" },
  { icon: Waves, text: "Pool and kids park" },
] as const;

export default function TouristDestinationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Destinations", path: "/tourist-destinations" }])}
      />
      <JsonLd data={destinationsJsonLd()} />
      <PageHero
        label="Destinations"
        lines={[{ text: "Places to visit" }, { text: "around Coorg." }]}
        description={<p>{destinationsIntro}</p>}
      />

      <section aria-label="Places near the resort" className="pb-[var(--space-section)]">
        <div className="page-container">
          <DestinationBrowser destinations={destinations} />
          <p className="mt-6 text-small text-body/80">{destinationsNote}</p>

          <ul
            aria-label="About the resort"
            className="mt-[var(--space-section)] grid grid-cols-2 gap-4 rounded-[6px] border border-line bg-card p-5 lg:grid-cols-4"
          >
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-small">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-olive"
                />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-label="Plan your stay"
        className="section-space theme-sand bg-surface text-body"
      >
        <div className="page-container">
          <p className="label-mono text-body">Plan your stay</p>
          <h2 className="mt-3 max-w-[18ch] text-h2">Stay close to all of it.</h2>
          <p className="mt-4 max-w-[46ch] text-body/80">
            Tell us your dates and who is coming. We reply with availability and rates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Enquire Now
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
