import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteConfig } from "@/config/site.config";
import { gettingHere } from "@/data/resortPlan";
import { mapsHref } from "@/lib/contact";

// Split into its own chunk (still server-rendered) so the first load hydrates less.
const ResortPlan = dynamic(() =>
  import("@/components/sections/ResortPlan").then((m) => m.ResortPlan),
);

/** Plan, "Getting here" strip, address and the narrow-road note. Used on the home page and /plan-your-stay. */
export function ResortPlanSection({
  id = "plan",
  heading = true,
  details = true,
}: {
  id?: string;
  heading?: boolean;
  details?: boolean;
}) {
  return (
    <section
      id={id}
      aria-label="Resort plan"
      className="section-space theme-sand scroll-mt-20 bg-surface text-body"
    >
      <div className="page-container">
        {heading && (
          <SectionHeader
            tone="dark"
            label="The resort plan"
            lines={[
              { text: "Find your way" },
              { text: "around the ", emphasis: "estate." },
            ]}
            description={<p>Tap a number to see what is there.</p>}
          />
        )}
        <ResortPlan className={heading ? "mt-8" : undefined} compact={heading} />

        {details && (
          <>
            <ol aria-label="Getting here" className="mt-8 grid gap-4 pt-6 sm:grid-cols-4">
              {gettingHere.map((step, index) => (
                <li key={step.label}>
                  <span className="label-mono text-body">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 font-display text-h4">{step.label}</p>
                  <p className="text-small text-body/80">{step.detail}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <address className="text-body/80 not-italic">
                  {siteConfig.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-2 max-w-[56ch] text-small text-body/80">
                  The access road is narrow for two vehicles to pass, so please drive
                  slowly.
                </p>
              </div>
              <a
                href={mapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary gap-2 self-start"
              >
                <MapPin size={16} strokeWidth={1.5} aria-hidden="true" /> Open in Google
                Maps
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
