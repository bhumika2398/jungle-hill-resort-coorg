import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { DestinationBrowser } from "@/components/sections/DestinationBrowser";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PageNote } from "@/components/shared/PageNote";
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

export default function TouristDestinationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Destinations", path: "/tourist-destinations" }])}
      />
      <JsonLd data={destinationsJsonLd()} />
      <PageHero
        label="Destinations"
        lines={[{ text: "Places to visit" }, { text: "around ", emphasis: "Coorg." }]}
        description={<p>{destinationsIntro}</p>}
      />

      <section aria-label="Places near the resort" className="pb-[var(--space-section)]">
        <div className="page-container">
          <DestinationBrowser destinations={destinations} />
          <p className="mt-8 text-small text-body">{destinationsNote}</p>
        </div>
      </section>

      <PageNote>
        Stay in one of our <Link href="/rooms">rooms</Link>, eat at the{" "}
        <Link href="/dining">restaurant</Link>, and see{" "}
        <Link href="/plan-your-stay">how to reach us from Madikeri</Link>.
      </PageNote>

      <section
        aria-label="Plan your stay"
        className="section-space bg-surface theme-sand text-body"
      >
        <div className="page-container">
          <p className="label-mono text-body">Plan your stay</p>
          <h2 className="mt-4 max-w-[18ch] text-h2">
            Stay close to all of it.
          </h2>
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
