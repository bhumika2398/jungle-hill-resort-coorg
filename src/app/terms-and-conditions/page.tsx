import { HoverLink as Link } from "@/components/shared/HoverLink";
import { JsonLd } from "@/components/shared/JsonLd";
import { LegalPage, type LegalSection } from "@/components/shared/LegalPage";
import { siteConfig } from "@/config/site.config";
import { checkTimes, houseRules } from "@/data/policies";
import { mailLink, telLink } from "@/lib/contact";
import { LEGAL_UPDATED } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Terms and conditions",
  description:
    "Terms for using the Jungle Hill Resort, Coorg website and for enquiries, stays, house rules and payment at the resort.",
  path: "/terms-and-conditions",
});

const { contact } = siteConfig;

// TODO: the resort must supply its cancellation and refund terms, confirm whether quoted rates include
// taxes, and confirm the governing-law wording below. This is a plain-language draft, not legal advice.
const sections: LegalSection[] = [
  {
    id: "about",
    heading: "About these terms",
    body: (
      <p>
        By using this website or sending an enquiry you agree to these terms. If you do
        not agree, please do not use the site. “We” means Jungle Hill Resort,{" "}
        {contact.addressOneLine}.
      </p>
    ),
  },
  {
    id: "enquiries",
    heading: "Enquiries and bookings",
    body: (
      <>
        <ul>
          <li>
            The website takes enquiries only. There is no online booking and no online
            payment.
          </li>
          <li>
            Sending an enquiry does not reserve a room. A stay is confirmed only when the
            resort tells you so, by phone, WhatsApp or email.
          </li>
          <li>
            Rooms are subject to availability on your dates. We may suggest another stay
            if the one you ask for is taken.
          </li>
          <li>
            Please give accurate details. We use them to reply to you and to prepare your
            stay.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "rates",
    heading: "Rates and payment",
    body: (
      <>
        <ul>
          <li>
            Any price shown on the site, for example “From ₹X per night”, is a starting
            guide. The rate that applies to your dates is the one the resort confirms to
            you.
          </li>
          <li>
            Offers and coupon codes are confirmed by the resort and may have conditions or
            dates. Entering a code on the form does not apply a discount by itself.
          </li>
          <li>Payment is made at the resort.</li>
          <li>
            Cancellation, change and refund terms are shared with you when your stay is
            confirmed.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "check-in",
    heading: "Check-in and check-out",
    body: (
      <p>
        Check-in is at {checkTimes.checkIn} and check-out at {checkTimes.checkOut}.{" "}
        {checkTimes.note}
      </p>
    ),
  },
  {
    id: "house-rules",
    heading: "House rules",
    body: (
      <>
        <p>
          These rules help every guest enjoy a quiet stay. By staying you agree to follow
          them.
        </p>
        <ul>
          {houseRules.map((rule) => (
            <li key={rule.title}>
              <strong>{rule.title}:</strong> {rule.text}
            </li>
          ))}
        </ul>
        <p>
          The resort may ask a guest who does not follow the rules to leave. Guests are
          responsible for loss or damage to the property caused by them or their party.
        </p>
      </>
    ),
  },
  {
    id: "your-use",
    heading: "Using this website",
    body: (
      <ul>
        <li>Use the site only for lawful purposes and to plan a genuine stay.</li>
        <li>
          Do not submit false or spam enquiries, try to break into the site, or interfere
          with how it works.
        </li>
        <li>
          Automated tools that send large numbers of requests may be blocked without
          notice.
        </li>
      </ul>
    ),
  },
  {
    id: "content",
    heading: "Our content",
    body: (
      <p>
        The photographs, text, logo and design on this site belong to the resort or its
        suppliers. You may view them and share a link to the site. Please do not copy,
        sell or reuse them without our written permission.
      </p>
    ),
  },
  {
    id: "third-parties",
    heading: "Links and third parties",
    body: (
      <p>
        The site links to services such as Google Maps and WhatsApp. We do not control
        them and are not responsible for their content or practices. Distances, travel
        times and details about places near the resort are given as a guide.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Our responsibility",
    body: (
      <>
        <p>
          We take care to keep the information on this site accurate, but we cannot
          promise it is always complete or up to date, or that the site will never be
          interrupted. Details can change, so please confirm what matters to you when you
          enquire.
        </p>
        <p>
          To the extent the law allows, we are not liable for losses that arise from using
          the website, or from events beyond our reasonable control, such as severe
          weather, landslides or road closures in the monsoon. Nothing in these terms
          limits any right you have under law that cannot be limited.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    heading: "Your data",
    body: (
      <p>
        How we handle your details is explained in the{" "}
        <Link href="/privacy-policy">Privacy policy</Link> and the{" "}
        <Link href="/cookie-policy">Cookie policy</Link>.
      </p>
    ),
  },
  {
    id: "law",
    heading: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India. Any dispute is subject to the
        courts at Madikeri, Kodagu, Karnataka.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes and contact",
    body: (
      <p>
        We may update these terms from time to time; the date at the top shows the latest
        version. Questions? Email <a href={mailLink}>{contact.email}</a> or call{" "}
        <a href={telLink}>{contact.phoneDisplay}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Terms and conditions", path: "/terms-and-conditions" },
        ])}
      />
      <LegalPage
        label="Legal"
        lines={[{ text: "Terms," }, { text: "plainly ", emphasis: "put." }]}
        updated={`Last updated ${LEGAL_UPDATED}`}
        intro="The ground rules for using this website, sending an enquiry and staying with us."
        sections={sections}
      />
    </>
  );
}
