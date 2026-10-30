import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealImage } from "@/components/animations/RevealImage";
import { Photo } from "@/components/shared/Photo";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { photo } from "@/lib/images";

// The strongest atmospheric photo on the estate: blue sky, layered forested hills and a curving red paver path.
const leadPhoto = photo(
  "/images/gallery/grounds-valley-path.jpg",
  "Red paver path curving through tall trees to forested hills under a blue sky with clouds",
);

// Four real things to do. Each row opens its block on /experiences (the restaurant has its own page).
const rows = [
  {
    name: "Swimming Pool",
    fact: "7 AM to 7 PM · 4.7 ft deep",
    href: "/experiences#swimming-pool",
    image: photo(
      "/images/gallery/pool-with-kids-pool.jpg",
      "Swimming pool and shallow kids pool on a tiled deck with chairs",
    ),
  },
  {
    name: "Kids Park",
    fact: "For children under 10",
    href: "/experiences#kids-park",
    image: photo(
      "/images/gallery/kids-park-sign-play.jpg",
      "Kids Park sign with climbing frame and slide",
    ),
  },
  {
    name: "Indoor and Outdoor Games",
    fact: "Carrom, table tennis, ludo, chess, shuttle badminton",
    href: "/experiences#games",
    image: photo(
      "/images/gallery/games-table-tennis.jpg",
      "Table-tennis table under a roof among trees",
    ),
  },
  {
    name: "Restaurant",
    fact: "7 AM to 10 PM",
    href: "/dining",
    image: photo(
      "/images/gallery/dining-restaurant-entrance.jpg",
      "Restaurant entrance framed by coffee plants",
    ),
  },
];

/** An arch-framed pool photo on the left; label, heading, a short note and four equal rows on the right. */
export function HomeExperiences() {
  return (
    <section
      id="experiences"
      aria-label="Experiences"
      className="section-space theme-sand bg-surface text-body"
    >
      <div className="page-container grid items-center gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 lg:col-span-5">
          <RevealImage className="mx-auto max-w-md lg:max-w-none">
            <div className="arch-frame relative h-[420px] overflow-hidden bg-card">
              <Photo
                image={leadPhoto}
                objectPosition="50% 40%"
                fill
                sizes="(min-width: 1024px) 40vw, 92vw"
                imgClassName="transition-transform duration-500 [@media(hover:hover)]:hover:scale-[1.03]"
              />
            </div>
          </RevealImage>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <SectionHeader
            tone="dark"
            label="Experiences"
            lines={[{ text: "Slow days," }, { text: "easy evenings." }]}
          />
          <p className="mt-4 max-w-[52ch]">
            A pool with a shallow kids section, a play area for children under 10, indoor
            and outdoor games, and a restaurant serving South Indian, North Indian and
            Chinese food.
          </p>

          <ul className="mt-5 grid gap-3">
            {rows.map((row) => (
              <li key={row.name} className="min-w-0">
                <Link
                  href={row.href}
                  className="group shadow-soft flex items-center gap-4 rounded-[6px] border border-line bg-card p-2 pr-4"
                >
                  <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-[4px]">
                    <Photo image={row.image} fill sizes="56px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl leading-tight">
                      {row.name}
                    </span>
                    <span className="mt-0.5 block truncate text-small text-body/80">
                      {row.fact}
                    </span>
                  </span>
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

          <Link
            href="/experiences"
            className="link-underline mt-5 inline-flex items-center gap-2 font-medium text-burgundy"
          >
            Explore Experiences{" "}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
