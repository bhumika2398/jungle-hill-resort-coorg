import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { VideoBackground } from "@/components/animations/VideoBackground";
import { RevealText } from "@/components/animations/RevealText";
import { estateVideoSources } from "@/data/site";
import { photo } from "@/lib/images";
import { whatsappLink } from "@/lib/contact";
import { Photo } from "@/components/shared/Photo";

const poster = photo(
  "/images/gallery/grounds-valley-path.jpg",
  "Paver path with the green valley beyond",
);

export function CTA() {
  return (
    <section
      aria-label="Enquire"
      className="section-space theme-sand relative isolate overflow-hidden bg-surface text-body"
    >
      <VideoBackground poster={poster} sources={estateVideoSources} />
      <div aria-hidden="true" className="absolute inset-0 bg-ivory/90" />
      <div className="page-container relative grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <RevealText
            lines={[{ text: "Ask us about" }, { text: "your ", emphasis: "dates." }]}
            className="text-h2"
          />
          <p className="mt-4 max-w-[46ch] text-body/80">
            Tell us when you would like to come and who is coming. We reply with
            availability and rates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">
              Enquire Now
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline gap-2"
            >
              <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-xs overflow-hidden lg:col-span-5 lg:mx-0 lg:ml-auto lg:block">
          <div className="arch-frame theme-sage relative aspect-[4/5] overflow-hidden bg-surface">
            <Photo image={poster} fill sizes="28vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
