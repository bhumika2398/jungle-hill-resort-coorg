import Link from "next/link";
import { RevealImage } from "@/components/animations/RevealImage";
import { Photo } from "@/components/shared/Photo";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { experiences } from "@/data/experiences";
import { cn } from "@/lib/utils";

// Mixed-size mosaic. Tiles without a photo yet fall back to a typographic panel.
const tileLayout = [
  "lg:col-span-7 lg:row-span-2 min-h-[22rem]",
  "lg:col-span-5 min-h-[16rem]",
  "lg:col-span-5 min-h-[16rem]",
  "lg:col-span-12 min-h-[14rem]",
];

const panelTone = [
  "bg-surface theme-sage text-body",
  "bg-surface theme-sage text-body",
  "bg-surface theme-sand text-body",
  "bg-surface theme-sage text-body",
];

export function Experiences() {
  return (
    <section id="experiences" aria-label="Things to do" className="section-space">
      <div className="page-container">
        <SectionHeader
          label="On the property"
          lines={[
            { text: "Water, swings," },
            { text: "and ", emphasis: "slow", after: " games." },
          ]}
        />

        <ul className="mt-8 grid gap-4 lg:auto-rows-[15rem] lg:grid-cols-12">
          {experiences.map((item, index) => {
            const caption = (
              <>
                <p className="label-mono opacity-80">{item.label}</p>
                <h3 className="mt-1 text-2xl sm:text-3xl">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm opacity-90">{item.summary}</p>
                <ul className="label-mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] opacity-80">
                  {item.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </>
            );

            return (
              <li
                key={item.slug}
                className={cn("relative flex", tileLayout[index % tileLayout.length])}
              >
                <RevealImage className="relative flex w-full" delay={index * 0.06}>
                  {item.images[0] ? (
                    <>
                      <div className="relative w-full overflow-hidden">
                        <Photo
                          image={item.images[0]}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 border border-line bg-surface p-4 text-body sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm">
                        {caption}
                      </div>
                    </>
                  ) : (
                    <div
                      className={cn(
                        "flex w-full flex-col justify-end p-6",
                        panelTone[index % panelTone.length],
                      )}
                    >
                      {caption}
                    </div>
                  )}
                </RevealImage>
              </li>
            );
          })}
        </ul>

        <p className="mt-8">
          <Link href="/experiences" className="label-mono link-underline">
            Pool rules, timings and games
          </Link>
        </p>
      </div>
    </section>
  );
}
