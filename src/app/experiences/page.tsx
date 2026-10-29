import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealImage } from "@/components/animations/RevealImage";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/shared/PageHero";
import { Photo } from "@/components/shared/Photo";
import { dining } from "@/data/dining";
import { experiences } from "@/data/experiences";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Pool, kids park and games",
  description:
    "A swimming pool with a kids pool, a play area for under-10s, indoor games and outdoor shuttle badminton at Jungle Hill Resort, a coffee estate retreat in Coorg.",
  path: "/experiences",
});

const bySlug = (slug: string) => experiences.find((item) => item.slug === slug);
const pool = bySlug("swimming-pool");
const kids = bySlug("kids-park");
const indoor = bySlug("indoor-games");

/** Four blocks, one photo each. Facts come straight from the resort's own information. */
const blocks = [
  pool && {
    id: "swimming-pool",
    label: "Pool",
    title: "Swimming pool",
    summary: pool.summary,
    facts: pool.facts.slice(0, 4),
    image: pool.images[0],
  },
  kids && {
    id: "kids-park",
    label: "Kids",
    title: "Kids park",
    summary: kids.summary,
    facts: ["For children under 10", "See-saw", "Giraffe slide", "Swings"],
    image: kids.images[0],
  },
  indoor && {
    id: "games",
    label: "Games",
    title: "Indoor and outdoor games",
    summary:
      "Carrom, table tennis, ludo, chess and foosball indoors, and shuttle badminton outdoors, within the property premises.",
    facts: ["Carrom and table tennis", "Ludo and chess", "Foosball", "Shuttle badminton"],
    image: indoor.images[1] ?? indoor.images[0],
  },
  {
    id: "restaurant",
    label: "Dining",
    title: "Restaurant",
    summary:
      "South Indian, North Indian and Chinese food, served through the day in the estate.",
    facts: [dining.hours, "Last order at 9:30 PM", "Orders 30 to 40 minutes ahead"],
    image: dining.images[0],
    href: "/dining",
  },
].filter(Boolean) as {
  id: string;
  label: string;
  title: string;
  summary: string;
  facts: string[];
  image: (typeof dining.images)[number] | undefined;
  href?: string;
}[];

export default function ExperiencesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Experiences", path: "/experiences" }])} />
      <PageHero
        label="On the property"
        lines={[{ text: "Water, swings," }, { text: "and slow games." }]}
        description={
          <p>
            Between meals and the view there is a pool, a play area for children and a few
            games. Nothing here is loud.
          </p>
        }
      />

      <section aria-label="Things to do" className="pb-[var(--space-section)]">
        <ol className="page-container space-y-6 lg:space-y-8">
          {blocks.map((block, index) => (
            <li
              key={block.id}
              id={block.id}
              className="grid scroll-mt-28 items-center gap-5 lg:grid-cols-2 lg:gap-8"
            >
              <RevealImage className={cn(index % 2 === 1 && "lg:order-2")}>
                <div className="relative h-[260px] overflow-hidden rounded-[6px] bg-card sm:h-[360px]">
                  <Photo
                    image={block.image}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              </RevealImage>
              <div>
                <p className="label-mono text-body/70">{block.label}</p>
                <h2 className="mt-2 text-h3">{block.title}</h2>
                <p className="mt-3 max-w-[46ch] text-body">{block.summary}</p>
                <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-small text-body/80 sm:grid-cols-2">
                  {block.facts.map((fact) => (
                    <li key={fact} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-1 w-1 shrink-0 bg-olive"
                      />
                      {fact}
                    </li>
                  ))}
                </ul>
                {block.href && (
                  <Link
                    href={block.href}
                    className="link-underline mt-4 inline-flex items-center gap-2 font-medium text-burgundy"
                  >
                    See the restaurant{" "}
                    <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <CTA />
    </>
  );
}
