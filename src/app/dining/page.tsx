import { CTA } from "@/components/sections/CTA";
import { OrderingGuidelines } from "@/components/dining/OrderingGuidelines";
import { RestaurantActions } from "@/components/dining/RestaurantActions";
import { RestaurantTimings } from "@/components/dining/RestaurantTimings";
import { PageHero } from "@/components/shared/PageHero";
import { PhotoGrid } from "@/components/shared/PhotoGrid";
import { gallery } from "@/data/gallery";
import { dining as staticDining } from "@/data/dining";
import { getRestaurant } from "@/lib/site-content";
import { to24h } from "@/lib/restaurant";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, restaurantJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Restaurant",
  description:
    "The in-house restaurant at Jungle Hill Resort, Coorg: freshly prepared meals in a calm setting amid nature, for families and couples. See meal timings and ordering guidelines.",
  path: "/dining",
});

export const revalidate = 3600;

export default async function DiningPage() {
  const dining = await getRestaurant();
  // Photos come from the gallery's Dining category. The open-air restaurant set is shown in the Gallery only.
  const hidden = (src: string) => src.includes("restaurant-open-air");
  const photos = [
    ...staticDining.images,
    ...gallery.filter(
      (image) =>
        image.category === "Dining" &&
        !hidden(image.src) &&
        !staticDining.images.some((d) => d.src === image.src),
    ),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Dining", path: "/dining" }])} />
      <JsonLd
        data={restaurantJsonLd({
          cuisines: dining.cuisines,
          opens: to24h(dining.opens) ?? "07:00",
          closes: to24h(dining.closes) ?? "22:00",
        })}
      />
      <PageHero
        label="Restaurant"
        lines={[{ text: "A table" }, { text: "in the estate." }]}
        description={<p>{dining.intro}</p>}
      />

      <section
        aria-label="Timings and guidelines"
        className="section-space theme-sage bg-surface text-body"
      >
        <div className="page-container grid items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RestaurantTimings
              opens={dining.opens}
              closes={dining.closes}
              meals={dining.meals}
              cuisines={dining.cuisines}
            />
          </div>
          <div className="lg:col-span-7">
            <OrderingGuidelines guidelines={dining.guidelines} />
            <RestaurantActions />
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
