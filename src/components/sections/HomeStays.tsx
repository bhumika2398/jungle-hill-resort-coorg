import { HoverLink as Link } from "@/components/shared/HoverLink";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import { Photo } from "@/components/shared/Photo";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getRooms } from "@/lib/site-content";
import { compact } from "@/lib/images";

const ORDER = [
  "deluxe-ac-rooms",
  "standard-non-ac-cottage",
  "family-ac-room",
  "standard-non-ac-room",
];

/** Home page stays: only the photo and the name. The whole card opens the stay page. */
export async function HomeStays() {
  const all = await getRooms();
  const rooms = compact(ORDER.map((slug) => all.find((room) => room.slug === slug)));

  return (
    <section
      id="stays"
      aria-label="Our stays"
      className="section-space theme-sage scroll-mt-20 bg-surface text-body"
    >
      <div className="page-container grid gap-5 lg:grid-cols-12 lg:gap-6 pr-[4.25rem] lg:pr-20">
        <div className="lg:col-span-4 lg:pt-4">
          <SectionHeader
            tone="dark"
            lines={[{ text: "Where you'll stay" }]}
            description={
              <p>
                Rooms and cottages among the coffee and pepper plants. Rates are shared on
                enquiry, for your dates.
              </p>
            }
          />
          <Link href="/rooms" className="btn btn-outline hard-shadow mt-6 inline-flex">
            View All Stays
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {rooms.map((room, index) => (
            <li key={room.slug} className="min-w-0">
              <FadeUp index={index} className="h-full">
                <Link
                  href={`/rooms/${room.slug}`}
                  className="group shadow-soft block h-full overflow-hidden rounded-[6px] border border-line bg-card focus-visible:outline-2"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[220px]">
                    <Photo
                      image={room.images[0]}
                      fill
                      sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 100vw"
                      imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <span className="font-display text-[1.45rem] leading-tight">
                      {room.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burgundy text-ivory"
                    >
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
