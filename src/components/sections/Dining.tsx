import { HoverLink as Link } from "@/components/shared/HoverLink";
import { RevealImage } from "@/components/animations/RevealImage";
import { Photo } from "@/components/shared/Photo";
import { MealTimetable } from "@/components/shared/MealTimetable";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { dining } from "@/data/dining";
import { homeImages } from "@/data/site";

export function Dining() {
  const lead = dining.images[0] ?? homeImages.diningA;

  return (
    <section
      id="dining"
      aria-label="Dining"
      className="section-space theme-sage bg-surface text-body"
    >
      <div className="page-container grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <SectionHeader
            tone="dark"
            label="Restaurant"
            lines={[{ text: "A table" }, { text: "in the ", emphasis: "estate." }]}
            description={
              <p>
                The in-house restaurant serves through the day. Orders are cooked fresh,
                so please allow a little time.
              </p>
            }
          />

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Cuisines">
            {dining.cuisines.map((cuisine) => (
              <li key={cuisine} className="label-mono border border-line px-3 py-2">
                {cuisine}
              </li>
            ))}
          </ul>

          <div className="mt-8 max-w-md">
            <MealTimetable meals={dining.meals} hours={dining.hours} />
          </div>
        </div>

        <div className="lg:col-span-6">
          <RevealImage>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Photo image={lead} fill sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
          </RevealImage>

          <h3 className="label-mono mt-6 !font-mono text-body/80">Ordering guidelines</h3>
          <ul className="mt-4 space-y-3">
            {dining.guidelines.map((guideline) => (
              <li key={guideline} className=" pt-3">
                {guideline}
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/dining" className="label-mono link-underline">
              Restaurant page
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
