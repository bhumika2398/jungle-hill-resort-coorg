import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { telLink, whatsappLink } from "@/lib/contact";

const ask = "Hello Jungle Hill Resort, I have a question about the restaurant.";

/** Ways to reach the resort about the restaurant, plus the route to planning a stay. */
export function RestaurantActions() {
  return (
    <div className="mt-6 rounded-[6px] border border-line bg-surface p-5 sm:p-6">
      <p className="font-display text-2xl leading-tight">
        Questions about the restaurant?
      </p>
      <p className="mt-1 max-w-[52ch] text-small">
        Ask us about timings or arrangements, or enquire about a stay and we will reply
        with availability.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={telLink} className="btn btn-outline">
          <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
          Call {siteConfig.contact.phoneDisplay}
        </a>
        <a
          href={whatsappLink(ask)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          <MessageCircle size={16} strokeWidth={1.6} aria-hidden="true" />
          WhatsApp us
        </a>
        <Link href="/booking" className="btn">
          <CalendarCheck size={16} strokeWidth={1.6} aria-hidden="true" />
          Enquire about a stay
        </Link>
      </div>
    </div>
  );
}
