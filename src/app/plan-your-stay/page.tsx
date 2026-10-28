import { Mail, MapPin, Phone } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { ResortPlanSection } from "@/components/sections/ResortPlanSection";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site.config";
import { faqs as staticFaqs } from "@/data/faqs";
import { restaurantFaqAnswer } from "@/lib/restaurant";
import { getRestaurant } from "@/lib/site-content";
import { checkTimes } from "@/data/policies";
import { mailLink, mapsHref, telLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { PageNote } from "@/components/shared/PageNote";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Plan your stay",
  description:
    "How to reach Jungle Hill Resort, 5 km from Madikeri on the way to Virajpet, plus check-in and check-out times, house rules and answers to common questions.",
  path: "/plan-your-stay",
});

const steps = [
  "Head for Madikeri, the main town of Coorg.",
  "From Madikeri take the road towards Virajpet. The resort is about 5 km along it.",
  "The address is Mekeri Village, Madikeri. Open the map link below for the exact pin.",
  "The access road is narrow and two vehicles cannot pass easily. Please drive slowly and give way.",
];

export const revalidate = 3600;

export default async function PlanYourStayPage() {
  const restaurant = await getRestaurant();
  const faqs = staticFaqs.map((faq) =>
    faq.id === "restaurant" ? { ...faq, answer: restaurantFaqAnswer(restaurant) } : faq,
  );
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.addressOneLine)}&output=embed`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Plan your stay", path: "/plan-your-stay" }])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        label="08 — Plan your stay"
        lines={[{ text: "Getting here," }, { text: "and ", emphasis: "staying." }]}
        description={
          <p>
            Five kilometres from Madikeri on the way to Virajpet, surrounded by coffee and
            pepper plantations.
          </p>
        }
      />

      <ResortPlanSection id="plan" heading={false} />

      <section aria-label="Location and directions" className="pb-[var(--space-section)]">
        <div className="page-container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="label-mono !font-mono text-xs text-body">Address</h2>
            <address className="mt-3 font-display text-3xl not-italic">
              {siteConfig.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={mapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary gap-2"
              >
                <MapPin size={16} strokeWidth={1.5} aria-hidden="true" /> Open in Google
                Maps
              </a>
              <a href={telLink} className="btn btn-outline gap-2">
                <Phone size={16} strokeWidth={1.5} aria-hidden="true" />{" "}
                {siteConfig.contact.phoneDisplay}
              </a>
              <a href={mailLink} className="btn btn-outline gap-2">
                <Mail size={16} strokeWidth={1.5} aria-hidden="true" /> Email
              </a>
            </div>

            <h2 className="label-mono mt-8 !font-mono text-xs text-body">How to reach</h2>
            <ol className="mt-4">
              {steps.map((step, index) => (
                <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-2 py-4">
                  <span className="label-mono pt-1 text-body">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {/* TODO: nearby Coorg ideas, only once the resort confirms what to recommend */}
          </div>

          <div className="lg:col-span-7">
            <div className="theme-sage aspect-[4/3] w-full overflow-hidden border border-line bg-surface">
              <iframe
                title="Map showing Jungle Hill Resort"
                src={embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <p className="mt-3 text-sm text-body">
              The map searches for the address. If the pin looks off, use the Google Maps
              button or call us.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label="Check-in and check-out"
        className="section-space theme-sage relative isolate overflow-hidden bg-surface"
      >
        <div className="page-container grid gap-6 sm:grid-cols-3">
          <div>
            <p className="label-mono text-body">Check-in</p>
            <p className="mt-2 font-display text-5xl">{checkTimes.checkIn}</p>
          </div>
          <div>
            <p className="label-mono text-body">Check-out</p>
            <p className="mt-2 font-display text-5xl">{checkTimes.checkOut}</p>
          </div>
          <p className="text-body">
            {checkTimes.note} ID proof is mandatory, visitors are not allowed after 8:30
            PM, and there is no loud music or loud sound after 10:00 PM.
          </p>
        </div>
      </section>

      <section
        aria-label="Frequently asked questions"
        className="section-space relative isolate overflow-hidden"
      >
        <div className="page-container grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label-mono text-body">Questions</p>
            <h2 className="mt-4 text-h3">
              Things people <em className="font-light text-body">ask.</em>
            </h2>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="label-mono text-body transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-body">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PageNote>
        Once you know the way, look at the four <Link href="/rooms">rooms</Link>, the{" "}
        <Link href="/dining">restaurant</Link> and the{" "}
        <Link href="/experiences">pool, play area and games</Link>, then{" "}
        <Link href="/contact">send us your dates</Link>.
      </PageNote>
      <CTA />
    </>
  );
}
