import Link from "next/link";
import { MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { RevealImage } from "@/components/animations/RevealImage";
import { Photo } from "@/components/shared/Photo";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteConfig } from "@/config/site.config";
import { mapsHref } from "@/lib/contact";
import { photo } from "@/lib/images";

const image = photo(
  "/images/gallery/grounds-two-storey-block-02.jpg",
  "Two-storey room block with a tiled roof and balcony among trees",
);

export function Location() {
  return (
    <section id="location" aria-label="Location" className="section-space">
      <div className="page-container grid gap-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-6">
          <SectionHeader
            label="Find us"
            lines={[
              { text: "Five kilometres" },
              { text: "from ", emphasis: "Madikeri." },
            ]}
          />
          <Reveal className="mt-6 max-w-lg space-y-5">
            <p>
              The resort sits among coffee and pepper plantations, on the way to Virajpet.
              The access road is narrow, so drive slowly.
            </p>
            <address className="not-italic">
              <span className="label-mono block text-body">Address</span>
              {siteConfig.contact.addressLines.map((line) => (
                <span key={line} className="block font-display text-2xl">
                  {line}
                </span>
              ))}
            </address>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={mapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark gap-2"
              >
                <MapPin size={16} strokeWidth={1.5} aria-hidden="true" /> Open in Google
                Maps
              </a>
              <Link href="/plan-your-stay" className="btn btn-outline">
                How to reach
              </Link>
            </div>
          </Reveal>
        </div>

        <RevealImage className="lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
            <Photo image={image} fill sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </RevealImage>
      </div>
    </section>
  );
}
