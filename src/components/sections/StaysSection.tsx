import { HoverLink as Link } from "@/components/shared/HoverLink";
import { StayCards } from "@/components/sections/StayCards";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { rooms } from "@/data/rooms";

/** The four stays as boxed cards. Details live on the stay pages. */
export function StaysSection() {
  return (
    <section
      id="stays"
      aria-label="The stays"
      className="section-space theme-sage scroll-mt-20 bg-surface text-body"
    >
      <div className="page-container">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            tone="dark"
            label="The stays"
            lines={[{ text: "Four ways" }, { text: "to ", emphasis: "stay." }]}
            description={<p>Rates are on enquiry, for your dates.</p>}
          />
          <Link href="/rooms" className="btn btn-outline self-start sm:self-end">
            All stays
          </Link>
        </div>
        <div className="mt-8">
          <StayCards rooms={rooms} />
        </div>
      </div>
    </section>
  );
}
