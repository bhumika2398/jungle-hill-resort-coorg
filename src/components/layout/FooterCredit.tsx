import { HoverLink as Link } from "@/components/shared/HoverLink";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site.config";

/** Centred bottom bar: copyright, then the developer credit with a real outbound link. */
export function FooterCredit() {
  const { developer } = siteConfig;

  return (
    <div className="mt-6 flex flex-col items-center gap-4 pt-6 text-center">
      <p className="label-mono text-[0.6875rem] tracking-[0.22em] text-body/80">
        &copy; {new Date().getFullYear()} Jungle Hill Resort
      </p>
      <nav aria-label="Legal">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-small">
          {[
            ["Privacy policy", "/privacy-policy"],
            ["Terms and conditions", "/terms-and-conditions"],
            ["Cookie policy", "/cookie-policy"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link
                prefetch={false}
                href={href!}
                className="touch-target inline-flex items-center transition-colors hover:text-burgundy"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="max-w-none font-display text-[clamp(0.95rem,1.7vw,1.275rem)] leading-snug font-light text-body/80">
        <em className="font-light">Designed and developed by</em>{" "}
        <a
          href={developer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="touch-target group inline-flex items-center gap-1 font-medium tracking-[0.04em] whitespace-nowrap text-body transition-colors hover:text-body focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy"
        >
          {developer.name}
          <ArrowUpRight
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          />
        </a>
      </p>
    </div>
  );
}
