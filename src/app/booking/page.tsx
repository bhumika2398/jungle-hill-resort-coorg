import { Suspense } from "react";
import { EnquiryWizard } from "@/components/forms/EnquiryWizard";
import { PageHero } from "@/components/shared/PageHero";
import { siteConfig } from "@/config/site.config";
import { mailLink, telLink } from "@/lib/contact";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Enquire about a stay",
  description:
    "Send an enquiry for your dates. There is no online booking yet: we reply with availability and rates, or you can send the same details on WhatsApp.",
  path: "/contact",
  noIndex: true,
});

export default function BookingPage() {
  return (
    <>
      <PageHero
        label="Enquire"
        lines={[{ text: "Tell us" }, { text: "your ", emphasis: "dates." }]}
        description={
          <p>
            Three short steps. We reply with availability and rates; nothing is booked
            until we confirm.
          </p>
        }
      />
      <section aria-label="Enquiry form" className="pb-[var(--space-section)]">
        <div className="page-container grid gap-5 lg:grid-cols-12">
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
          <aside className="lg:col-span-4">
            <div className="brutal-card p-5">
              <p className="label-mono text-body">Prefer to talk?</p>
              <a
                href={telLink}
                className="link-underline mt-2 block font-display text-h4"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              <p className="mt-2 text-small text-body">
                Also on WhatsApp. Check-in 12 PM, check-out 11 AM.
              </p>
              <p className="mt-3 text-small">
                <a href={mailLink} className="link-underline break-all">
                  {siteConfig.contact.email}
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
