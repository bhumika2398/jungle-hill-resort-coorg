import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroFade } from "@/components/animations/HeroFade";
import { HeroMedia } from "@/components/animations/HeroMedia";
import { RevealText } from "@/components/animations/RevealText";
import { resolveHeroSlides } from "@/data/hero";

export function Hero() {
  return (
    <section
      aria-label="Welcome"
      className="dark-surface relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-ink text-ivory md:min-h-[clamp(30rem,38vw,36rem)]"
    >
      <HeroMedia slides={resolveHeroSlides()} />
      {/* Plain vertical scrim for legibility: no colour, no blobs */}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/10" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink/45 via-ink/20 to-transparent"
      />

      {/* Faint fog haze near the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ivory/20 to-transparent"
      />

      {/* Soft top scrim so the navigation stays legible over bright photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/25 to-transparent"
      />

      <div className="page-container relative flex flex-1 flex-col justify-end pt-24 pb-14">
        <HeroFade>
          <p className="label-mono text-ivory [text-shadow:0_1px_14px_rgba(100,28,43,0.7)]">
            Coffee estate · Madikeri, Coorg
          </p>
        </HeroFade>

        <RevealText
          as="h1"
          immediate
          onDark
          delay={0.1}
          lines={[{ text: "Rest above" }, { text: "the ", emphasis: "cloudline." }]}
          className="mt-5 max-w-3xl text-h1"
        />

        <HeroFade delay={0.35}>
          <p className="mt-8 max-w-lg text-lg text-ivory [text-shadow:0_1px_14px_rgba(100,28,43,0.6)]">
            Thirteen rooms in a coffee and pepper estate, five kilometres from Madikeri.
          </p>
        </HeroFade>

        <HeroFade delay={0.45} className="mt-8">
            <Link href="/rooms" className="btn btn-primary gap-2">
              Explore Our Resort
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Link>
        </HeroFade>
      </div>
    </section>
  );
}
