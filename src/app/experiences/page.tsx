import Link from "next/link";
import { RevealImage } from "@/components/animations/RevealImage";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/shared/PageHero";
import { Photo } from "@/components/shared/Photo";
import { PhotoGrid } from "@/components/shared/PhotoGrid";
import { experiences } from "@/data/experiences";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { PageNote } from "@/components/shared/PageNote";

export const metadata = buildMetadata({
  title: "Pool, kids park and games",
  description:
    "A swimming pool with a kids pool, a play area for under-10s, indoor games and outdoor shuttle badminton at Jungle Hill Resort, a coffee estate retreat in Coorg.",
  path: "/experiences",
});

export default function ExperiencesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Experiences", path: "/experiences" }])} />
      <PageHero
        label="03 — On the property"
        lines={[
          { text: "Water, swings," },
          { text: "and ", emphasis: "slow", after: " games." },
        ]}
        description={
          <p>
            Between meals and the view there is a pool, a play area for children and a few
            games. Nothing here is loud.
          </p>
        }
      />

      <section aria-label="Things to do" className="pb-[var(--space-section)]">
        <ol className="page-container">
          {experiences.map((item) => (
            <li
              key={item.slug}
              id={item.slug}
              className="grid scroll-mt-28 items-center gap-6 py-6 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-5">
                <p className="label-mono text-body/70">{item.label}</p>
                <h2 className="mt-2 text-h3">{item.title}</h2>
                <p className="mt-3 max-w-md text-body">{item.summary}</p>
                {item.facts.length > 0 && (
                  <p className="mt-4 text-small text-body/80">{item.facts.join(" · ")}</p>
                )}
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                {
                  item.images.length > 1 ? (
                    <PhotoGrid images={item.images} />
                  ) : item.images[0] ? (
                    <RevealImage>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Photo
                          image={item.images[0]}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      </div>
                    </RevealImage>
                  ) : null /* TODO: add a photo to public/images/experiences and reference it in data/experiences.ts */
                }
              </div>
            </li>
          ))}
        </ol>
        <p className="page-container mt-4">
          <Link href="/gallery" className="label-mono link-underline">
            More photographs in the gallery
          </Link>
        </p>
      </section>

      <PageNote>
        The pool, kids play area and games are all on the estate, close to the{" "}
        <Link href="/rooms">rooms</Link> and the <Link href="/dining">restaurant</Link>.
        For directions from Madikeri and house rules, see{" "}
        <Link href="/plan-your-stay">plan your stay</Link>.
      </PageNote>
      <CTA />
    </>
  );
}
