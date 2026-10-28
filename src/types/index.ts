export interface NavItem {
  label: string;
  href: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Tiny base64 placeholder for next/image blur. */
  blurDataURL?: string;
}

export interface Room {
  slug: string;
  /** Display number, e.g. "01". */
  number: string;
  /** Distinctive display name, e.g. "The Cloudline Suite". */
  name: string;
  /** Official category from the brochure, e.g. "Deluxe AC Room". */
  category: string;
  /** Optional mono label that replaces "category · size" on cards and the detail page. */
  label?: string;
  /** Short category for forms, e.g. "Deluxe AC". */
  categoryShort: string;
  /** Three short facts for the stay cards. */
  highlights: [string, string, string];
  /** One-line summary for lists. */
  summary: string;
  description: string;
  sizeSqFt: number;
  bed: string;
  /** Who the room suits, as stated by the resort. */
  occupancy: string;
  /** Extra-mattress and similar guest notes. */
  guestNotes: string[];
  amenities: string[];
  /** Floor and room-number notes, only where known. */
  locations: string[];
  /** Always "Enquire for rates" until pricing is supplied. */
  rateNote: string;
  /** Price per night in INR; null until pricing is supplied. */
  price: number | null;
  imageFolder: string;
  images: ImageAsset[];
}

export interface Experience {
  slug: string;
  title: string;
  label: string;
  summary: string;
  facts: string[];
  /** Every real photo of this experience; the first is the lead image. */
  images: ImageAsset[];
}

export interface MealTime {
  name: string;
  time: string;
}

export interface DiningInfo {
  /** Welcome paragraph shown under the Dining page heading. */
  intro: string;
  cuisines: string[];
  /** Opening and closing time, as written for guests, for example "7:00 AM". */
  opens: string;
  closes: string;
  /** "opens to closes", derived. */
  hours: string;
  meals: MealTime[];
  guidelines: string[];
  images: ImageAsset[];
}

export type GalleryCategory =
  "Reception" | "Rooms" | "Pool" | "Dining" | "Kids Park" | "Games" | "Grounds";

export interface GalleryImage extends ImageAsset {
  category: GalleryCategory;
}

export interface Testimonial {
  /** Verbatim part of a long review, shown on the home page. */
  excerpt?: string;
  /** Sub-ratings Google showed for this review, where they exist. */
  details?: { rooms: number; service: number; location: number };
  highlights?: string[];
  id: string;
  name: string;
  /** 1 to 5 */
  rating: number;
  timeAgo: string;
  tripType?: string;
  text: string;
  source: "Google";
  profileUrl?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface PolicyItem {
  title: string;
  text: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Production origin, no trailing slash. */
  siteUrl: string;
  url: string;
  locale: string;
  contact: {
    email: string;
    phoneDisplay: string;
    phoneTel: string;
    /** Digits only with country code, used for wa.me links. */
    whatsapp: string;
    addressLines: string[];
    addressOneLine: string;
    mapsUrl: string;
  };
  /** Number behind the floating Call and WhatsApp buttons. */
  floatingContact: { phoneDisplay: string; phoneTel: string; whatsapp: string };
  stay: { checkIn: string; checkOut: string };
  socials: SocialLink[];
  developer: { name: string; url: string };
}
