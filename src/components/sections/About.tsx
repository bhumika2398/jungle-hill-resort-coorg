import { RevealImage } from "@/components/animations/RevealImage";
import { Reveal } from "@/components/animations/Reveal";
import { Photo } from "@/components/shared/Photo";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { homeImages } from "@/data/site";

export function About() {
  return (
    <section id="welcome" aria-label="Welcome" className="section-space">
      <div className="page-container grid gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <SectionHeader
            label="Welcome"
            lines={[{ text: "Coffee, pepper" }, { text: "and ", emphasis: "quiet." }]}
          />
          <Reveal className="mt-4 max-w-xl space-y-5">
            <p>
              Jungle Hill Resort is a nature retreat surrounded by lush coffee and pepper
              plantations, just 5 km from Madikeri on the way to Virajpet.
            </p>
            <p>
              There are 13 well-maintained rooms across Standard Non-AC, Deluxe AC and
              Family AC categories. A swimming pool, a kids play area, indoor games and
              outdoor shuttle badminton fill the day, and the in-house restaurant serves
              South Indian, North Indian and Chinese food.
            </p>
            <p>It is designed for relaxation and a peaceful stay in nature.</p>
          </Reveal>

          <Reveal className="mt-8 max-w-md">
            <div className="brutal-card p-6">
              <p className="label-mono text-body">Quiet by design</p>
              <p className="mt-3 font-display text-2xl leading-tight">
                Quiet hours from 10:00 PM: no loud music or loud sounds.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6">
          <p className="label-mono mb-4 text-body lg:text-right">13 rooms · 4 stays</p>
          <div className="grid grid-cols-12 items-start gap-4">
            <RevealImage parallax className="col-span-8">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Photo
                  image={homeImages.welcomeA}
                  fill
                  sizes="(min-width: 1024px) 30vw, 66vw"
                />
              </div>
            </RevealImage>
            <RevealImage className="col-span-5 col-start-8 -mt-8 sm:-mt-16" delay={0.12}>
              <div className="relative aspect-square overflow-hidden border-8 border-line">
                <Photo
                  image={homeImages.welcomeB}
                  fill
                  sizes="(min-width: 1024px) 20vw, 42vw"
                />
              </div>
            </RevealImage>
          </div>
        </div>
      </div>
    </section>
  );
}
