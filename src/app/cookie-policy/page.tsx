import { HoverLink as Link } from "@/components/shared/HoverLink";
import { JsonLd } from "@/components/shared/JsonLd";
import { LegalPage, type LegalSection } from "@/components/shared/LegalPage";
import { siteConfig } from "@/config/site.config";
import { mailLink } from "@/lib/contact";
import { LEGAL_UPDATED } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Cookie policy",
  description:
    "What cookies and browser storage the Jungle Hill Resort, Coorg website uses. No advertising or analytics cookies.",
  path: "/cookie-policy",
});

// Keep this list in step with the site: if analytics, ads or new embeds are ever added, update it
// (and the cookie notice) before they go live.
const sections: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "What cookies are",
    body: (
      <p>
        Cookies are small files a website saves in your browser. Browsers also offer
        similar storage (“local” and “session” storage). We use the word “cookies” for
        both below.
      </p>
    ),
  },
  {
    id: "what-we-use",
    heading: "What this site uses",
    body: (
      <>
        <p>
          The site does not use advertising, tracking or analytics cookies. It uses only
          these small pieces of storage, all of which are essential or simple
          conveniences:
        </p>
        <ul>
          <li>
            <strong>Intro animation (session storage, “jhr-intro-seen”):</strong>{" "}
            remembers that you have already seen the opening animation during this visit,
            so it is not repeated. It disappears when you close the tab.
          </li>
          <li>
            <strong>Cookie notice (local storage, “jhr-cookie-notice”):</strong> remembers
            that you dismissed the notice at the bottom of the page, so it does not
            reappear.
          </li>
          <li>
            <strong>Staff sign-in (cookies):</strong> set only for resort staff who sign
            in to the private admin area. Visitors never receive them.
          </li>
        </ul>
        <p>None of these identify you or follow you to other websites.</p>
      </>
    ),
  },
  {
    id: "third-parties",
    heading: "Third-party content",
    body: (
      <>
        <ul>
          <li>
            <strong>Google Maps:</strong> the Plan your stay page shows an embedded Google
            map. When that page loads, Google may set its own cookies and receive your IP
            address. This is governed by Google’s privacy policy. If you prefer, skip the
            page or open the map link in a new tab instead.
          </li>
          <li>
            <strong>Links out:</strong> buttons that open WhatsApp or Google Maps take you
            to those services, which have their own cookie rules.
          </li>
        </ul>
        <p>
          The site’s fonts are served from our own site, not from Google, so they set no
          cookies.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    heading: "Your choices",
    body: (
      <>
        <p>
          You can block or delete cookies and site storage in your browser settings. The
          site keeps working without them, though the intro animation may play more often
          and the notice may reappear.
        </p>
        <p>
          To clear what this site has saved, use your browser’s “Clear site data” option
          for this website.
        </p>
      </>
    ),
  },
  {
    id: "more",
    heading: "More information",
    body: (
      <p>
        For how we handle the details you send us, read the{" "}
        <Link href="/privacy-policy">Privacy policy</Link>. Questions about cookies:{" "}
        <a href={mailLink}>{siteConfig.contact.email}</a>.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Cookie policy", path: "/cookie-policy" }])}
      />
      <LegalPage
        label="Legal"
        lines={[{ text: "Cookies," }, { text: "kept to the ", emphasis: "minimum." }]}
        updated={`Last updated ${LEGAL_UPDATED}`}
        intro="What this website saves in your browser, and why."
        sections={sections}
      />
    </>
  );
}
