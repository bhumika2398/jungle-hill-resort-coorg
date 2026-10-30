import { GalleryBrowser } from "@/components/sections/GalleryBrowser";
import { PageHero } from "@/components/shared/PageHero";
import { Photo } from "@/components/shared/Photo";
import { photo } from "@/lib/images";
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

// A faint misty-valley photograph behind the stage, under a black overlay.
const backdrop = photo(
  "/images/gallery/grounds-misty-valley.jpg",
  "Mist over the valley beyond the resort's tiled roofs",
);

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
        lines={[{ text: "The property," }, { text: "as it is." }]}
        description={
          <p>
            Real photographs of the resort. Browse the photographs, filter by category, or
            open any photo full size.
          </p>
        }
      />
      <section
        aria-label="Photographs"
        className="relative isolate overflow-hidden bg-black py-[var(--space-section)] text-ivory"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Photo image={backdrop} fill sizes="100vw" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <div className="page-container">
          <GalleryBrowser images={gallery} categories={galleryCategories} />
        </div>
      </section>
    </>
  );
}
