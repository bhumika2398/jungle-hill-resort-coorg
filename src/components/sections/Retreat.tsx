import { HoverLink as Link } from "@/components/shared/HoverLink";
import { ArrowUpRight } from "lucide-react";
import { VideoBackground } from "@/components/animations/VideoBackground";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { homeImages, rainVideoSources } from "@/data/site";
import { CountUp } from "@/components/animations/CountUp";
import { RevealImage } from "@/components/animations/RevealImage";
import { Photo } from "@/components/shared/Photo";

const stats: { value: string; count?: number; suffix?: string; label: string }[] = [
  { value: "13", count: 13, label: "Rooms" },
  { value: "4", count: 4, label: "Stay types" },
  { value: "5 km", count: 5, suffix: " km", label: "From Madikeri" },
  { value: "7 AM – 10 PM", label: "Restaurant" },
];

const strip = [
  { label: "Pool", href: "/experiences#swimming-pool" },
  { label: "Kids Park", href: "/experiences#kids-park" },
  { label: "Games", href: "/experiences#games" },
  { label: "Restaurant", href: "/dining" },
];

/** Short introduction: one paragraph, four real facts and a slim strip to the amenities. */
export function Retreat() {
  return (
    <section
      id="retreat"
      aria-label="The retreat"
      className="section-space mist-top relative isolate overflow-hidden bg-surface text-body"
    >
      {rainVideoSources.length > 0 && (
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-15">
          <VideoBackground
            poster={homeImages.welcomeB}
            sources={rainVideoSources}
            sizes="100vw"
          />
        </div>
      )}
      <div className="page-container">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <SectionHeader
              label="The retreat"
              lines={[{ text: "Coffee, pepper" }, { text: "and ", emphasis: "quiet." }]}
            />
            <p className="mt-5 max-w-[48ch] text-body-lg">
              Thirteen rooms among coffee and pepper plantations, five kilometres from
              Madikeri. Quiet by design, with a pool, a restaurant and room to breathe.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[16rem] lg:col-span-4 lg:max-w-none">
            <RevealImage className="arch-frame theme-sage relative aspect-[3/4] overflow-hidden bg-surface">
              <Photo
                image={homeImages.welcomeA}
                fill
                sizes="(min-width: 1024px) 28vw, 70vw"
              />
            </RevealImage>
            <div
              aria-hidden="true"
              className="theme-sand absolute -bottom-3 -left-3 border border-line bg-surface px-4 py-2 font-display text-4xl leading-none text-body"
            >
              01
            </div>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className=" py-5 pr-4 odd:border-r odd:border-line lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <dd className="font-display text-h3 leading-none">
                {stat.count !== undefined ? (
                  <CountUp to={stat.count} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </dd>
              <dt className="label-mono mt-2 text-body">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <ul
          aria-label="On the property"
          className="mt-8 grid grid-cols-2 sm:grid-cols-4"
        >
          {strip.map((item) => (
            <li key={item.label} className="border-line [&:not(:last-child)]:sm:border-r">
              <Link
                href={item.href}
                className="label-mono group flex min-h-14 items-center justify-between gap-3 px-4 first:pl-0 hover:text-body"
              >
                {item.label}
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
