import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryWizard } from "@/components/forms/EnquiryWizard";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site.config";
import { checkTimes } from "@/data/policies";
import { mailLink, mapsHref, telLink, whatsappLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, contactPageJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Contact and enquiries",
  description:
    "Enquire about a stay at Jungle Hill Resort, Coorg in three short steps, or call, WhatsApp or email reservations@junglehillresort.co.in. We reply with rates.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <JsonLd data={contactPageJsonLd()} />
      <PageHero
        label="Contact"
        lines={[{ text: "Tell us" }, { text: "your ", emphasis: "dates." }]}
        description={
          <p>
            There is no booking engine yet. Send an enquiry and we reply with availability
            and rates.
          </p>
        }
      />

      <section
        aria-label="Enquiry form and contact details"
        className="pb-[var(--space-section)]"
      >
        <div className="page-container grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <p className="min-h-[45rem] text-body" role="status">
                  Loading the form…
                </p>
              }
            >
              <EnquiryWizard />
            </Suspense>
          </div>

          <aside aria-label="Contact details" className="lg:col-span-4">
            <div className="rounded-[6px] border border-line bg-card p-5 text-body hard-shadow lg:sticky lg:top-24">
              <p className="label-mono text-body">Reservations</p>
              <a
                href={telLink}
                className="link-underline mt-2 flex items-center gap-2 font-display text-h4"
              >
                <Phone size={18} strokeWidth={1.5} aria-hidden="true" />{" "}
                {contact.phoneDisplay}
              </a>
              <p className="mt-3 flex flex-wrap gap-3">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary gap-2"
                >
                  <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />{" "}
                  WhatsApp
                </a>
              </p>
              <ul className="mt-5 space-y-3 pt-4 text-small">
                <li className="flex items-start gap-2">
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  />
                  <a href={mailLink} className="link-underline break-all">
                    {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  />
                  <span>
                    {contact.addressOneLine}
                    <br />
                    <a
                      href={mapsHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      Open in Google Maps
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock
                    size={16}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="mt-1 shrink-0"
                  />
                  <span>
                    Check-in {checkTimes.checkIn} · Check-out {checkTimes.checkOut}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
          </>
  );
}
