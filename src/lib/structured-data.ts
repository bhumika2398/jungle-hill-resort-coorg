import { siteConfig } from "@/config/site.config";
import { destinations, mapsSearchUrl } from "@/data/destinations";
import { dining } from "@/data/dining";
import { roomTitle } from "@/data/rooms";
import type { Faq, Room } from "@/types";

const ORIGIN = siteConfig.siteUrl;
const absUrl = (src: string) => (/^https?:\/\//.test(src) ? src : `${ORIGIN}${src}`);
const abs = (path: string) => `${ORIGIN}${path === "/" ? "" : path}`;

const address = {
  "@type": "PostalAddress",
  streetAddress: "Mekeri Village, Madikeri",
  addressLocality: "Madikeri",
  addressRegion: "Karnataka",
  postalCode: "571201",
  addressCountry: "IN",
};

/** schema.org Resort. Only facts supplied by the resort: no ratings, reviews or price range. */
export function resortJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Resort", "LodgingBusiness"],
    "@id": `${ORIGIN}/#resort`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: ORIGIN,
    logo: `${ORIGIN}/images/logo/logo.png`,
    image: [
      `${ORIGIN}/images/hero/hero-a-dusk-cottages.jpg`,
      `${ORIGIN}/images/hero/hero-b-coffee-view.jpg`,
    ],
    telephone: siteConfig.contact.phoneTel,
    email: siteConfig.contact.email,
    address,
    // TODO: add geo { latitude, longitude } once the exact coordinates are confirmed.
    checkinTime: "12:00",
    checkoutTime: "11:00",
    numberOfRooms: 13,
    ...(siteConfig.socials.length
      ? { sameAs: siteConfig.socials.map((s) => s.href) }
      : {}),
    amenityFeature: [
      "Swimming pool",
      "Kids play area",
      "Restaurant",
      "Indoor games",
      "Outdoor shuttle badminton",
      "Parking",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  };
}

export function roomJsonLd(room: Room) {
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: roomTitle(room),
    description: room.description,
    url: abs(`/rooms/${room.slug}`),
    image: room.images.slice(0, 3).map((img) => absUrl(img.src)),
    bed: { "@type": "BedDetails", typeOfBed: room.bed },
    floorSize: { "@type": "QuantitativeValue", value: room.sizeSqFt, unitCode: "FTK" },
    occupancy: { "@type": "QuantitativeValue", description: room.occupancy },
    amenityFeature: room.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    containedInPlace: { "@id": `${ORIGIN}/#resort` },
  };
}

export function restaurantJsonLd(
  info: { cuisines: string[]; opens: string; closes: string } = {
    cuisines: dining.cuisines,
    opens: "07:00",
    closes: "22:00",
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Restaurant at ${siteConfig.shortName}`,
    url: abs("/dining"),
    servesCuisine: info.cuisines,
    telephone: siteConfig.contact.phoneTel,
    address,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: info.opens,
      closes: info.closes,
    },
    parentOrganization: { "@id": `${ORIGIN}/#resort` },
  };
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.shortName}`,
    url: abs("/contact"),
    mainEntity: { "@id": `${ORIGIN}/#resort` },
  };
}

/** ItemList of TouristAttraction entries. No ratings. */
export function destinationsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tourist destinations near Jungle Hill Resort, Coorg",
    itemListElement: destinations.map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristAttraction",
        name: place.name,
        description: place.description,
        url: mapsSearchUrl(place.name),
        ...(place.image ? { image: `${ORIGIN}${place.image.src}` } : {}),
      },
    })),
  };
}
