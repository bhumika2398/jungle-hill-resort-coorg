import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ResortPlan } from "@/components/sections/ResortPlan";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site.config";
<<<<<<< HEAD
import { dining } from "@/data/dining";
import { faqs } from "@/data/faqs";
=======
import { faqs as staticFaqs } from "@/data/faqs";
import { restaurantFaqAnswer } from "@/lib/restaurant";
import { getRestaurant } from "@/lib/site-content";
>>>>>>> 3854fae197c58984ac3d6874f530173ab57763de
import { checkTimes } from "@/data/policies";
import { gettingHere } from "@/data/resortPlan";
import { mapsHref } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Plan your stay",
  description:
    "How to reach Jungle Hill Resort, 5 km from Madikeri on the way to Virajpet, plus check-in and check-out times, house rules and answers to common questions.",
  path: "/plan-your-stay",
});

const sections = [
  { id: "getting-here", label: "Getting here" },
  { id: "resort-map", label: "Resort map" },
  { id: "stay-details", label: "Stay details" },
  { id: "house-rules", label: "House rules" },
  { id: "faqs", label: "FAQs" },
] as const;

const stayDetails = [
  ["Check-in", checkTimes.checkIn],
  ["Check-out", checkTimes.checkOut],
  ["Early check-in or late check-out", "Chargeable and subject to availability"],
  ["Restaurant", dining.hours.replace(":00", "").replace(":00", "")],
  ["Pool", "7 AM to 7 PM"],
] as const;

const houseRules = [
  "ID proof is mandatory.",
  "No visitors after 8:30 PM.",
  "No loud music or sounds after 10:00 PM.",
  "No outside food.",
  "Alcohol only on your own balcony.",
  "Pool: swimwear or nylon dresses only.",
  "A quiet resort, no parties.",
];

<<<<<<< HEAD
/** One label, one heading, short content. */
function Block({
  id,
  index,
  title,
  tone,
  children,
}: {
  id: (typeof sections)[number]["id"];
  index: number;
  title: string;
  tone: "theme-ivory" | "theme-sage" | "theme-sand";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("section-space scroll-mt-32 bg-surface text-body", tone)}
    >
      <div className="page-container">
        <p className="label-mono text-body/70">
          {String(index).padStart(2, "0")} / {title}
        </p>
        <h2 id={`${id}-title`} className="mt-2 text-h3">
          {title}
        </h2>
        <div className="mt-[var(--space-head)]">{children}</div>
      </div>
    </section>
  );
}
=======
export const revalidate = 3600;

export default async function PlanYourStayPage() {
  const restaurant = await getRestaurant();
  const faqs = staticFaqs.map((faq) =>
    faq.id === "restaurant" ? { ...faq, answer: restaurantFaqAnswer(restaurant) } : faq,
  );
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.contact.addressOneLine)}&output=embed`;
>>>>>>> 3854fae197c58984ac3d6874f530173ab57763de

export default function PlanYourStayPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Plan your stay", path: "/plan-your-stay" }])}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <PageHero
        label="Visit"
        lines={[{ text: "Plan your stay" }]}
        description={
          <p>
            Five kilometres from Madikeri on the way to Virajpet, among coffee and pepper
            plantations.
          </p>
        }
      />

      <nav
        aria-label="On this page"
        className="bg-surface text-body lg:sticky lg:top-[4.5rem] lg:z-30"
      >
        <ul className="page-container flex flex-wrap gap-x-6 gap-y-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="label-mono link-underline touch-target inline-flex items-center text-burgundy"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Block id="getting-here" index={1} title="Getting here" tone="theme-ivory">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            <address className="font-display text-2xl leading-snug not-italic">
              {siteConfig.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
<<<<<<< HEAD
            <p className="mt-3">5 km from Madikeri on the way to Virajpet.</p>
            <a
              href={mapsHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4 gap-2"
            >
              <MapPin size={16} strokeWidth={1.5} aria-hidden="true" /> Open in Google
              Maps
            </a>
            <p className="mt-4 max-w-[46ch] text-small text-body/80">
              The access road is narrow for two vehicles to pass, so please drive slowly.
=======
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
>>>>>>> 3854fae197c58984ac3d6874f530173ab57763de
            </p>
          </div>

<<<<<<< HEAD
          <ol aria-label="Route" className="grid grid-cols-2 gap-3 self-start">
            {gettingHere.map((step, index) => (
              <li
                key={step.label}
                className="rounded-[6px] border border-line bg-card p-[var(--space-card)]"
              >
                <span className="label-mono text-body/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 font-display text-xl leading-tight">{step.label}</p>
                <p className="text-small text-body/80">{step.detail}</p>
              </li>
=======
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
>>>>>>> 3854fae197c58984ac3d6874f530173ab57763de
            ))}
          </ol>
        </div>
      </Block>

      <Block id="resort-map" index={2} title="Resort map" tone="theme-sage">
        <ResortPlan compact />
      </Block>

      <Block id="stay-details" index={3} title="Stay details" tone="theme-sand">
        <dl className="grid gap-3 sm:grid-cols-2">
          {stayDetails.map(([term, value]) => (
            <div
              key={term}
              className="rounded-[6px] border border-line bg-card p-[var(--space-card)]"
            >
              <dt className="label-mono text-body/70">{term}</dt>
              <dd className="mt-1 font-display text-xl leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block id="house-rules" index={4} title="House rules" tone="theme-ivory">
        <ol className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {houseRules.map((rule, index) => (
            <li key={rule} className="grid grid-cols-[2rem_1fr] items-baseline">
              <span className="label-mono text-body/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="faqs" index={5} title="FAQs" tone="theme-sage">
        <FaqAccordion faqs={faqs} />
      </Block>

      <CTA />
    </>
  );
}
