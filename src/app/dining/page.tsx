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
        lines={[{ text: "A table" }, { text: "in the ", emphasis: "estate." }]}
        description={
          <p>
            The in-house restaurant serves South Indian, North Indian and Chinese food
            through the day, from 7:00 AM to 10:00 PM.
          </p>
        }
      />

      <section
        aria-label="Meal times"
        className="section-space bg-surface theme-sage text-body"
      >
        <div className="page-container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MealTimetable meals={dining.meals} hours={dining.hours} />
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Cuisines">
              {dining.cuisines.map((cuisine) => (
                <li key={cuisine} className="label-mono border border-line px-3 py-2">
                  {cuisine}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="label-mono !font-mono text-xs text-body">
              Ordering guidelines
            </h2>
            <ul className="mt-4">
              {dining.guidelines.map((guideline) => (
                <li key={guideline} className=" py-4 text-lg">
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
            <p className="label-mono text-body">The restaurant</p>
            <h2 className="mt-4 mb-6 text-h3">Where you will eat</h2>
            <PhotoGrid images={photos} mainRatio="aspect-[21/9]" />
          </div>
        </section>
      )}

            <CTA />
    </>
  );
}
