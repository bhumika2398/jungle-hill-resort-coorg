import { HoverLink as Link } from "@/components/shared/HoverLink";
import { JsonLd } from "@/components/shared/JsonLd";
import { LegalPage, type LegalSection } from "@/components/shared/LegalPage";
import { siteConfig } from "@/config/site.config";
import { mailLink, telLink } from "@/lib/contact";
import { LEGAL_UPDATED } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How Jungle Hill Resort, Coorg collects, uses and protects the details you send through our enquiry and contact forms.",
  path: "/privacy-policy",
});

const { contact } = siteConfig;

// TODO: have the resort (and ideally a lawyer) confirm the retention period, the grievance contact and
// the list of service providers before publishing. This is a plain-language draft, not legal advice.
const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <p>
          This site is run by Jungle Hill Resort, {contact.addressOneLine}. In this policy
          “we” and “us” mean the resort. For anything about your data, write to{" "}
          <a href={mailLink}>{contact.email}</a> or call{" "}
          <a href={telLink}>{contact.phoneDisplay}</a>.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          We only collect what you choose to send us, plus a small amount of technical
          data to keep the site safe.
        </p>
        <ul>
          <li>
            <strong>Enquiry form:</strong> your name, phone number and email; your dates,
            number of rooms and guests (adults, children, infants) and the ages of any
            children; the stay you prefer; an offer or coupon code if you enter one; your
            arrival time, occasion and any requests; and your confirmation that you have
            read the house rules and agree to be contacted.
          </li>
          <li>
            <strong>Contact form:</strong> your name, email, optional phone number and
            your message.
          </li>
          <li>
            <strong>Technical data:</strong> your IP address, used only to limit repeated
            form submissions (see “How long we keep it”).
          </li>
        </ul>
        <p>
          We do not take payments on this website and never ask for card or bank details
          here. Payment is made at the resort.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    heading: "Why we use it",
    body: (
      <>
        <ul>
          <li>To reply to you with availability, rates and any offer that applies.</li>
          <li>To plan and confirm your stay, and to contact you about it.</li>
          <li>To keep the website free of spam and misuse.</li>
          <li>To meet our legal obligations, such as guest records the law requires.</li>
        </ul>
        <p>
          We rely on your consent, which you give when you tick the box and send a form.
          You can withdraw it at any time (see “Your rights”). We do not use your details
          for advertising, and we do not sell them.
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: (
      <p>
        This website is for adults planning a stay. If you travel with children we ask
        only for their ages, so that we can suggest the right rooms. Please send this
        information only if you are their parent or legal guardian. We do not track or
        profile children and we do not send them marketing.
      </p>
    ),
  },
  {
    id: "who-we-share-with",
    heading: "Who we share it with",
    body: (
      <>
        <p>
          Your enquiry is seen by our reservations team. We use a few service providers to
          run the website. They handle data only on our behalf:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> stores enquiries and the photos shown on the site.
          </li>
          <li>
            <strong>Upstash</strong> holds short-lived counters used to limit repeated
            form submissions.
          </li>
          <li>
            <strong>Our hosting provider</strong> delivers the website to your browser.
          </li>
          <li>
            <strong>Google Maps</strong> is embedded on the Plan your stay page (see our{" "}
            <Link href="/cookie-policy">Cookie policy</Link>).
          </li>
        </ul>
        <p>
          Some of these providers may store or process data outside India. We share your
          details with authorities only when the law requires it.
        </p>
      </>
    ),
  },
  {
    id: "how-long",
    heading: "How long we keep it",
    body: (
      <>
        <ul>
          <li>
            Enquiries and messages are kept for up to 24 months after our last
            conversation with you, then deleted. Enquiries we mark as spam are deleted
            sooner.
          </li>
          <li>
            IP addresses used for rate limiting are kept for about 10 minutes and then
            expire automatically.
          </li>
          <li>Records we must keep by law are kept for as long as the law requires.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    heading: "How we protect it",
    body: (
      <p>
        Data travels between your browser and our site over an encrypted (HTTPS)
        connection. Stored enquiries can be opened only by authorised resort staff who
        sign in to a private admin area, and the database is not open to the public. No
        system is perfectly secure, so please do not send sensitive information such as
        card numbers through the forms.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights",
    body: (
      <>
        <p>Under India’s Digital Personal Data Protection Act, 2023 you may ask us to:</p>
        <ul>
          <li>tell you what personal data of yours we hold and how we use it;</li>
          <li>correct or update it;</li>
          <li>erase it, unless we must keep it by law;</li>
          <li>stop using it, by withdrawing your consent; and</li>
          <li>nominate someone to exercise these rights on your behalf.</li>
        </ul>
        <p>
          Email <a href={mailLink}>{contact.email}</a> and we will aim to reply within 30
          days. If you are not satisfied with our reply, you may complain to the Data
          Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    heading: "Cookies",
    body: (
      <p>
        The site uses very little browser storage and no advertising or analytics cookies.
        See the <Link href="/cookie-policy">Cookie policy</Link> for the details.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        If we change this policy we will update the date at the top of this page. Please
        check back from time to time.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Privacy policy", path: "/privacy-policy" }])}
      />
      <LegalPage
        label="Legal"
        lines={[{ text: "Your data," }, { text: "and ", emphasis: "privacy." }]}
        updated={`Last updated ${LEGAL_UPDATED}`}
        intro="What we collect when you contact us, why, who sees it and how you can control it."
        sections={sections}
      />
    </>
  );
}
