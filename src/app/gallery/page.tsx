import { GalleryBrowser } from "@/components/sections/GalleryBrowser";
import { PageHero } from "@/components/shared/PageHero";
import { galleryCategories as allCategories } from "@/data/gallery";
import { getGallery } from "@/lib/site-content";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Browse photographs of the rooms, pool, restaurant, games and grounds at Jungle Hill Resort, a coffee and pepper plantation retreat near Madikeri, Coorg.",
  path: "/gallery",
});

export const revalidate = 3600;

export default async function GalleryPage() {
  const gallery = await getGallery();
  const galleryCategories = allCategories.filter((category) =>
    gallery.some((image) => image.category === category),
  );
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Gallery", path: "/gallery" }])} />
      <PageHero
        label="Gallery"
        lines={[{ text: "The property," }, { text: "as it ", emphasis: "is." }]}
        description={
          <p>
            Real photographs of the resort. Filter by category, or open any photo full
            size.
          </p>
        }
      />
      <section aria-label="Photographs" className="pb-[var(--space-section)]">
        <div className="page-container">
          <GalleryBrowser images={gallery} categories={galleryCategories} />
        </div>
      </section>
          </>
  );
}
