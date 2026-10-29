import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { RevealText } from "@/components/animations/RevealText";
import { NotesWall } from "@/components/sections/NotesWall";
import { JsonLd } from "@/components/shared/JsonLd";
import { spokenNotes } from "@/data/testimonials";
import { whatsappLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Guest notes",
  description:
    "Read 14 guest reviews of Jungle Hill Resort, Coorg, taken from Google and shown as written, including the four-star ones, with no edits to the words.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <section
      aria-label="Guest notes"
      className="bg-surface pt-28 pb-[var(--space-section)] text-body sm:pt-32"
    >
      <JsonLd data={breadcrumbJsonLd([{ name: "Guest notes", path: "/testimonials" }])} />
      <div className="page-container">
        <p className="label-mono text-body">Guest Notes</p>
        <RevealText
          as="h1"
          immediate
          lines={[{ text: "What guests wrote" }]}
          className="mt-4 text-h1"
        />
        <p className="mt-4 text-body/80">Real reviews from Google</p>

        <div className="mt-6 sm:mt-8">
          <NotesWall notes={spokenNotes} />
        </div>

        <div className="mt-8 sm:mt-10">
          <h2 className="font-display text-h3">Planning a stay?</h2>
          <div className="mt-5 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
