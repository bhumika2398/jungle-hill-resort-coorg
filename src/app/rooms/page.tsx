import { HoverLink as Link } from "@/components/shared/HoverLink";
import { ArrowRight, BedDouble, CalendarDays, Clock, Users } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { StayCards } from "@/components/sections/StayCards";
import { PageHero } from "@/components/shared/PageHero";
import { checkTimes } from "@/data/policies";
import { getRooms } from "@/lib/site-content";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Stays: rooms and cottages",
  description:
    "Stay at Jungle Hill Resort, Coorg: 13 rooms in four categories, from Standard Non-AC rooms to Deluxe AC and Family AC rooms. Rates are given on enquiry.",
  path: "/rooms",
});

export const revalidate = 3600;

export default async function RoomsPage() {
  const rooms = await getRooms();
  const priced = rooms.some((room) => room.price);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Stays", path: "/rooms" }])} />
      <PageHero
        label="Stays"
        lines={[{ text: "Four ways" }, { text: "to ", emphasis: "stay." }]}
        description={
          <p>
            {priced
              ? "13 rooms across four categories. Starting rates are shown for each stay; we confirm availability and the exact rate for your dates."
              : "13 rooms across four categories. No prices are published, so rates are given on enquiry, for your dates."}
          </p>
        }
        aside={
          <p className="label-mono text-body">
            13 rooms · 4 stays
            <br />
            Check-in {checkTimes.checkIn} · Check-out {checkTimes.checkOut}
          </p>
        }
      />

      <section aria-label="All stays" className="pb-[var(--space-section)]">
        <div className="page-container pr-[4.25rem] lg:pr-20">
          <StayCards rooms={rooms} variant="page" />
        </div>
      </section>

      <section
        aria-label="Good to know"
        className="section-space theme-sage relative isolate overflow-hidden bg-surface"
      >
        <div className="page-container pr-[4.25rem] lg:pr-20">
          <p className="label-mono text-body/70">Good to know</p>
          <h2 className="mt-2 text-h3">Before you choose</h2>

          <ul className="mt-[var(--space-head)] grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-[6px] border border-line bg-card p-4">
              <Users
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-olive"
              />
              <h3 className="mt-2 text-xl leading-tight">Who sleeps where</h3>
              <ul className="mt-2 space-y-1 text-[0.95rem] leading-[1.55]">
                <li>Standard Non-AC rooms and cottages: two adults and an infant only</li>
                <li>Deluxe AC Room: couples or small families</li>
                <li>Family AC Room: sleeps up to four</li>
              </ul>
            </li>
            <li className="rounded-[6px] border border-line bg-card p-4">
              <BedDouble
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-olive"
              />
              <h3 className="mt-2 text-xl leading-tight">Extra mattress</h3>
              <p className="mt-2 text-[0.95rem] leading-[1.55]">
                In the Deluxe and Family rooms an extra mattress can be arranged on
                request for one additional guest.
              </p>
            </li>
            <li className="rounded-[6px] border border-line bg-card p-4">
              <Clock
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-olive"
              />
              <h3 className="mt-2 text-xl leading-tight">Arrival and departure</h3>
              <ul className="mt-2 space-y-1 text-[0.95rem] leading-[1.55]">
                <li>Check-in is at {checkTimes.checkIn}</li>
                <li>Check-out is at {checkTimes.checkOut}</li>
                <li>{checkTimes.note}</li>
              </ul>
            </li>
            <li className="rounded-[6px] border border-line bg-card p-4">
              <CalendarDays
                size={22}
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-olive"
              />
              <h3 className="mt-2 text-xl leading-tight">Rates</h3>
              <p className="mt-2 text-[0.95rem] leading-[1.55]">
                {priced
                  ? "Starting rates are per night. Tell us your dates and who is travelling and we will confirm what is available and the exact rate."
                  : "Enquire for rates. Tell us your dates and who is travelling and we will reply with what is available."}
              </p>
              <Link
                href="/contact"
                className="link-underline mt-2 inline-flex items-center gap-1 text-[0.95rem] font-medium text-burgundy"
              >
                Enquire <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <CTA />
    </>
  );
}
