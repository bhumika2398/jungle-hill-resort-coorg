import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/shared/PageHero";
import { getRooms } from "@/lib/site-content";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Packages and offers",
  description:
    "Rates and any current offers at Jungle Hill Resort, Coorg are shared on enquiry. Tell us your dates and room preference and we will reply with availability.",
  path: "/packages-offers",
});

export const revalidate = 3600;

export default async function PackagesOffersPage() {
  const rooms = await getRooms();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Packages and offers", path: "/packages-offers" },
        ])}
      />
      <PageHero
        label="Packages and offers"
        lines={[{ text: "Rates," }, { text: "on ", emphasis: "request." }]}
        description={
          <p>
            We do not publish fixed packages or prices. Rates depend on the room and your
            dates, and any current offers are shared when you enquire.
          </p>
        }
      />
      {/* TODO: list real packages and offers here once the resort supplies them */}
      <section aria-label="How rates work" className="pb-[var(--space-section)]">
        <div className="page-container grid gap-5 lg:grid-cols-12">
          <ol className="lg:col-span-6">
            {[
              "Choose a stay: Standard Non-AC Room, Standard Non-AC Cottage, Deluxe AC Room or Family AC Room.",
              "Send your dates and who is travelling, by the enquiry form, WhatsApp or phone.",
              "We reply with availability, rates and any offer that applies.",
            ].map((step, index) => (
              <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 py-2.5">
                <span className="label-mono pt-1 text-body">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="label-mono text-body/70">{rooms[0]?.rateNote}</p>
            <ul className="mt-2 grid gap-2.5">
              {rooms.map((room) => (
                <li key={room.slug}>
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-[6px] border border-line bg-card px-4 py-3"
                  >
                    <span className="font-display text-xl">{room.name}</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="shrink-0 text-burgundy transition-transform group-hover:translate-x-[3px]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
