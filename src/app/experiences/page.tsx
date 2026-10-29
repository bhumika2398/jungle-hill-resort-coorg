import Link from "next/link";
import { CTA } from "@/components/sections/CTA";
import { PageHero } from "@/components/shared/PageHero";
import { PhotoGrid } from "@/components/shared/PhotoGrid";
import { experiences } from "@/data/experiences";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Pool, kids park and games",
  description:
    "A swimming pool with a kids pool, a play area for under-10s, indoor games and outdoor shuttle badminton at Jungle Hill Resort, a coffee estate retreat in Coorg.",
  path: "/experiences",
});

/** Short facts read as one line; longer ones as a tidy list. */
function Facts({ facts }: { facts: string[] }) {
  if (facts.length === 0) return null;
  if (facts.every((fact) => fact.length < 18)) {
    return <p className="mt-4 text-small text-body/80">{facts.join(" · ")}</p>;
  }
  return (
    <ul className="mt-4 space-y-1.5 text-small text-body/80">
      {facts.map((fact) => (
        <li key={fact} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 bg-olive" />
          {fact}
        </li>
      ))}
    </ul>
  );
}

export default function ExperiencesPage() {
  const withPhotos = experiences.filter((item) => item.images.length > 0);
  const withoutPhotos = experiences.filter((item) => item.images.length === 0);

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
        <ol className="page-container space-y-10 lg:space-y-12">
          {withPhotos.map((item) => (
            <li
              key={item.slug}
              id={item.slug}
              className="grid scroll-mt-28 items-start gap-5 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-4 lg:pt-2">
                <p className="label-mono text-body/70">{item.label}</p>
                <h2 className="mt-2 text-h3">{item.title}</h2>
                <p className="mt-3 max-w-[40ch] text-body">{item.summary}</p>
                <Facts facts={item.facts} />
              </div>
              <div className="lg:col-span-8">
                <PhotoGrid images={item.images} />
              </div>
            </li>
          ))}
        </ol>

        {withoutPhotos.length > 0 && (
          <div className="page-container mt-10 grid gap-5 lg:mt-12 lg:grid-cols-12 lg:gap-12">
            {withoutPhotos.map((item) => (
              <div key={item.slug} id={item.slug} className="scroll-mt-28 lg:col-span-4">
                <p className="label-mono text-body/70">{item.label}</p>
                <h2 className="mt-2 text-h3">{item.title}</h2>
                <p className="mt-3 max-w-[40ch] text-body">{item.summary}</p>
                <Facts facts={item.facts} />
                {/* TODO: add a photo to public/images/experiences and reference it in data/experiences.ts */}
              </div>
            ))}
          </div>
        )}

        <p className="page-container mt-8">
          <Link href="/gallery" className="link-underline font-medium text-burgundy">
            More photographs in the gallery
          </Link>
        </p>
      </section>

      <CTA />
    </>
  );
}
