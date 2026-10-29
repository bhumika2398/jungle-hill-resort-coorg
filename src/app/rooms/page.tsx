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
        <div className="page-container">
          <StayCards rooms={rooms} variant="page" />
        </div>
      </section>

      <section
        aria-label="Good to know"
        className="section-space relative isolate overflow-hidden bg-surface theme-sage"
      >
        <div className="page-container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label-mono text-body">Good to know</p>
            <h2 className="mt-4 text-h3">Before you choose</h2>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
            <li>
              <h3 className="text-2xl">Who sleeps where</h3>
              <p className="mt-2 text-body">
                Standard Non-AC rooms and cottages take two adults and an infant only. The
                Deluxe AC Room suits couples or small families, and the Family AC Room
                sleeps up to four.
              </p>
            </li>
            <li>
              <h3 className="text-2xl">Extra mattress</h3>
              <p className="mt-2 text-body">
                In the Deluxe and Family rooms an extra mattress can be arranged on
                request for one additional guest.
              </p>
            </li>
            <li>
              <h3 className="text-2xl">Arrival and departure</h3>
              <p className="mt-2 text-body">
                Check-in is at {checkTimes.checkIn} and check-out at {checkTimes.checkOut}
                . {checkTimes.note}
              </p>
            </li>
            <li>
              <h3 className="text-2xl">Rates</h3>
              <p className="mt-2 text-body">
                {priced
                  ? "Starting rates are per night. Tell us your dates and who is travelling and we will confirm what is available and the exact rate."
                  : "Enquire for rates. Tell us your dates and who is travelling and we will reply with what is available."}
              </p>
            </li>
          </ul>
        </div>
      </section>

            <CTA />
    </>
  );
}
