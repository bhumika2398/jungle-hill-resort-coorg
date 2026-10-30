import { HoverLink as Link } from "@/components/shared/HoverLink";
import { FadeUp } from "@/components/animations/FadeUp";
import { ParallaxBg } from "@/components/animations/ParallaxBg";
import { RevealText } from "@/components/animations/RevealText";
import { Photo } from "@/components/shared/Photo";
import { destinations } from "@/data/destinations";
import { compact, photo } from "@/lib/images";

const PICKS = ["abbey-falls", "rajas-seat", "madikeri-fort", "dubare-elephant-camp"];

// Misty viewpoint at Raja's Seat: a real property photo, softened by the olive overlay.
const backdrop = photo(
  "/images/destinations/rajas-seat-bg.webp",
  "Misty hills at sunset seen from Raja's Seat, Madikeri",
);

/** Olive band (one of two accent-filled bands) with a faint real photo and four destination tiles. */
export function ExploreBand() {
  const places = compact(PICKS.map((id) => destinations.find((d) => d.id === id)));

  return (
    <section
      id="explore"
      aria-label="Explore Madikeri"
      className="section-space relative isolate overflow-hidden bg-olive text-ivory"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <ParallaxBg className="absolute -inset-4">
          <Photo image={backdrop} fill sizes="100vw" imgClassName="grayscale-[25%]" />
        </ParallaxBg>
        <div className="absolute inset-0 bg-olive/[0.78]" />
      </div>

      <div className="page-container grid gap-5 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <RevealText
            as="h2"
            onDark
            lines={[
              { text: "Around Madikeri" },
            ]}
            className="mt-4 pb-1 text-h2"
          />
          <p className="mt-4 max-w-[44ch] text-ivory">
            Waterfalls, a fort, a viewpoint and an elephant camp, all within reach of the
            resort.
          </p>
          <Link
            href="/tourist-destinations"
            className="btn mt-6 inline-flex !border-ivory !bg-ivory !text-burgundy"
          >
            Plan Your Visit
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
          {places.map((place, index) => (
            <li key={place.id}>
              <FadeUp index={index}>
                <Link
                  href={`/tourist-destinations#${place.id}`}
                  className="group relative block aspect-[5/4] overflow-hidden rounded-[6px] border border-ivory/40"
                >
                  <Photo
                    image={place.image}
                    fill
                    sizes="(min-width: 1280px) 16vw, (min-width: 640px) 22vw, 45vw"
                    objectPosition={place.image?.objectPosition}
                    imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="glass absolute inset-x-2 bottom-2 rounded-[4px] px-3 py-2 font-display text-lg leading-tight transition-transform duration-300 group-hover:-translate-y-0.5">
                    {place.name}
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
