import { BookingBand } from "@/components/sections/BookingBand";
import { ExploreBand } from "@/components/sections/ExploreBand";
import { HomeExperiences } from "@/components/sections/HomeExperiences";
import { HomeFeatures } from "@/components/sections/HomeFeatures";
import { HomeStays } from "@/components/sections/HomeStays";
import { Hero } from "@/components/sections/Hero";
import { ResortPlanSection } from "@/components/sections/ResortPlanSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { JsonLd } from "@/components/shared/JsonLd";
import { resortJsonLd } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = {
  ...buildMetadata({
    description:
      "Jungle Hill Resort is a nature retreat in the coffee and pepper plantations of Coorg, 5 km from Madikeri. 13 rooms, a pool, a kids play area and a restaurant.",
    path: "/",
  }),
  // The layout's title template does not apply to the page in the same segment.
  title: { absolute: "Jungle Hill Resort, Coorg | Inspiring Cloudline" },
};

/** Hero, feature strip, stays, experiences, explore band, guest notes and the booking band. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="home-page">
      <JsonLd data={resortJsonLd()} />
      <Hero />
      <HomeFeatures />
      <HomeStays />
      <HomeExperiences />
      <ResortPlanSection details={false} />
      <ExploreBand />
      <Testimonials />
      <BookingBand />
    </div>
  );
}
