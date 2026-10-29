import { CTA } from "@/components/sections/CTA";
import { MealTimetable } from "@/components/shared/MealTimetable";
import { PageHero } from "@/components/shared/PageHero";
import { PhotoGrid } from "@/components/shared/PhotoGrid";
import { dining } from "@/data/dining";
import { gallery } from "@/data/gallery";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, restaurantJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Restaurant",
  description:
    "The restaurant at Jungle Hill Resort, Coorg serves South Indian, North Indian and Chinese food from 7:00 AM to 10:00 PM. See meal timings and ordering notes.",
  path: "/dining",
});

export default function DiningPage() {
  const photos = [
    ...dining.images,
    ...gallery.filter(
      (image) =>
        image.category === "Dining" && !dining.images.some((d) => d.src === image.src),
    ),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Dining", path: "/dining" }])} />
      <JsonLd data={restaurantJsonLd()} />
      <PageHero
        label="Restaurant"
        lines={[{ text: "A table" }, { text: "in the estate." }]}
        description={
          <p>
            The in-house restaurant serves South Indian, North Indian and Chinese food
            through the day, from 7:00 AM to 10:00 PM.
          </p>
        }
      />

      <section
        aria-label="Meal times"
        className="section-space theme-sage bg-surface text-body"
      >
        <div className="page-container grid gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="shadow-soft rounded-[6px] border border-line bg-card p-5 sm:p-6">
            <MealTimetable meals={dining.meals} hours={dining.hours} />
            <p className="mt-6 text-small text-body/80">{dining.cuisines.join(" · ")}</p>
          </div>
          <div className="shadow-soft rounded-[6px] border border-line bg-card p-5 sm:p-6">
            <h2 className="label-mono text-body/70">Ordering notes</h2>
            <ul className="mt-4 space-y-3">
              {dining.guidelines.map((guideline) => (
                <li key={guideline} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-1 w-1 shrink-0 bg-olive"
                  />
                  {guideline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section aria-label="Restaurant photographs" className="section-space">
          <div className="page-container">
            <h2 className="mb-5 text-h3">Where you will eat</h2>
            <PhotoGrid images={photos} mainRatio="aspect-[21/9]" />
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
