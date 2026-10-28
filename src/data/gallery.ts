import { imageManifest } from "@/data/generated/image-manifest";
import { rooms } from "@/data/rooms";
import { compact, photo } from "@/lib/images";
import type { GalleryCategory, GalleryImage } from "@/types";

/**
 * Every photo in public/images/gallery and public/images/dining is listed automatically.
 * The category comes from the filename prefix; the alt text from the table below (a generic
 * fallback is used for any new file, so add a line here when you add a photo).
 */
const ALT: Record<string, string> = {
  "grounds-paver-path-hills":
    "Red paver path curving through trees with hills in the distance",
  "grounds-building-garden": "Guest building with a stone base and lawn in front",
  "grounds-valley-tree-view":
    "View through the trees over the valley, with a small tiled roof below",
  "grounds-building-facade":
    "Front of a guest building with a stone retaining wall and garden",
  "grounds-driveway-palms": "Red paver driveway with palms and a room block beside it",
  "pool-palms": "Blue swimming pool with palms and banana plants behind",
  "pool-with-kids-pool":
    "Swimming pool and shallow kids pool on a tiled deck with chairs",
  "pool-kids-pool-float": "Kids pool with an inflatable ring beside the main pool",
  "pool-deck-kids-pool": "Pool deck with chairs and the stepped kids pool",
  "grounds-white-building-windows":
    "Low white building with large windows beside the red paver path",
  "grounds-paver-court": "Wide red paver court with palms and shrubs",
  "grounds-cottage-roofs-path": "Tiled cottage roofs along a red paver path",
  "pool-long-view": "Long view of the pool and its shallow kids section",
  "grounds-hill-view-green-roof": "Hills beyond palms with a green tiled roof below",
  "pool-deck-float": "Pool and tiled deck with an inflatable ring floating in the water",
  "grounds-path-palms-hedge": "Red paver path between a clipped hedge and palms",
  "grounds-path-blue-sky": "Paver path under tall palms and a bright blue sky",
  "grounds-sunset-palms": "Setting sun between palms and young conifers",
  "grounds-paver-court-buildings": "Room buildings at the end of a red paver court",
  "grounds-valley-green-roof": "Green-roofed cottage above the valley and hills",
  "grounds-path-balcony-block":
    "Paver path beside a balconied room block, with trees and blue sky",
  "grounds-path-trees": "Red paver path winding between tall trees",
  "grounds-two-storey-modern":
    "White two-storey block with glass balconies beside the path",
  "grounds-clouds-palms": "Clouds over the valley seen through palms",
  "grounds-valley-path": "Paver path with the green valley beyond",
  "grounds-path-trees-building":
    "Paver path under tall trees with a room block at the left",
  "grounds-path-shade": "Shaded paver path with palms and blue sky",
  "grounds-pavilion-green-roof":
    "Open pavilion with a green tiled roof beside the paver path",
  "grounds-misty-valley": "Mist over the valley beyond the resort's tiled roofs",
  "grounds-tiled-roof-cottages": "Tiled-roof cottages above a red paver driveway",
  "grounds-two-storey-block-01": "White two-storey room block with a stone staircase",
  "pool-water-closeup": "Pool water and blue tiles with palms behind",
  "reception-exterior": "Reception building with a red roof beside the paver drive",
  "grounds-cottages-garden": "Tiled-roof cottages among the garden and plantation",
  "grounds-yellow-flowers": "Yellow flowering shrubs against a blue sky",
  "grounds-two-storey-block-02": "Two-storey room block with a tiled roof and balcony",
  "kids-park-sign-play": "Kids Park sign with climbing frame and slide among the trees",
  "grounds-rooms-and-stairs": "Room blocks with a stair and a red paver walkway",
  "games-table-tennis": "Blue table-tennis table under a roof among trees",
  "dining-restaurant-entrance": "Restaurant entrance framed by coffee plants",
  "reception-entrance-path": "Path leading up to the reception entrance",
  "games-foosball": "Foosball table with red and blue players",
  "dining-glasses-detail": "Glasses on a restaurant table with the valley blurred behind",
  "games-carrom": "Carrom board with coins and a striker",
  "dining-terrace-table":
    "Restaurant table laid with cutlery and a flower vase, looking out to the trees",
  "grounds-waterfall": "Small stone waterfall feature among the greenery",
  "lounge-sofa-seating":
    "Sitting area with cushioned sofas under a timber-beamed ceiling",
  "restaurant-hall-01":
    "Restaurant hall with dark wood tables and a view into the plantation",
  "restaurant-hall-02": "Restaurant seating under a high timber roof with bamboo blinds",
  "restaurant-open-air-hall":
    "Open-sided restaurant under a high timber roof, with rows of wooden tables and chairs looking out to the trees",
  "restaurant-open-air-exterior":
    "Open-air restaurant seen from the garden, with its sign, coffee plants and palms in front",
  "restaurant-open-air-blinds":
    "Open-air restaurant hall with wooden tables and chairs, bamboo blinds along one wall and a polished timber floor under a high roof",
  "grounds-evening-path-lights":
    "Lit paver path curving through tall trees at night, with a play area glowing below",
};

function categoryOf(stem: string): GalleryCategory {
  if (stem.startsWith("reception")) return "Reception";
  if (stem.startsWith("pool")) return "Pool";
  if (stem.startsWith("dining") || stem.startsWith("restaurant")) return "Dining";
  if (stem.startsWith("kids-park")) return "Kids Park";
  if (stem.startsWith("games")) return "Games";
  if (stem.startsWith("lounge")) return "Rooms";
  return "Grounds";
}

function humanise(stem: string) {
  const text = stem.replace(/-\d+$/, "").replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const fromFolders: GalleryImage[] = compact(
  Object.keys(imageManifest)
    .filter(
      (key) => key.startsWith("/images/gallery/") || key.startsWith("/images/dining/"),
    )
    .sort((a, b) => a.localeCompare(b))
    .map((key): GalleryImage | null => {
      const stem = key
        .split("/")
        .pop()!
        .replace(/\.[a-z]+$/i, "");
      const image = photo(key, ALT[stem] ?? humanise(stem));
      return image ? { ...image, category: categoryOf(stem) } : null;
    }),
);

/**
 * Files that show (almost) the same picture as another one. They stay on their own pages but are left
 * out of the gallery, so no scene appears twice.
 */
const DUPLICATES = new Set([
  "/images/gallery/reception-entrance-path.jpg", // identical to reception-exterior
  "/images/gallery/grounds-valley-green-roof.jpg", // same view as grounds-hill-view-green-roof
  "/images/rooms/standard-non-ac-cottage/bathroom-02.jpg",
  "/images/rooms/standard-non-ac-cottage/bathroom-03.jpg",
  "/images/rooms/standard-non-ac-cottage/bedroom-03.jpg",
  "/images/rooms/standard-non-ac-cottage/bedroom-04.jpg",
  "/images/rooms/standard-non-ac-cottage/bedroom-06.jpg",
  "/images/rooms/standard-non-ac-cottage/bedroom-07.jpg",
]);

// A taste of every room category (all room photos are on the room pages).
const roomShots: GalleryImage[] = rooms.flatMap((room) =>
  room.images
    .filter((image) => !DUPLICATES.has(image.src))
    .slice(0, 6)
    .map((image): GalleryImage => ({ ...image, category: "Rooms" })),
);

const order: GalleryCategory[] = [
  "Reception",
  "Rooms",
  "Pool",
  "Dining",
  "Kids Park",
  "Games",
  "Grounds",
];

// Reception comes first, with the exterior shot as the very first photo.
const FIRST = "/images/gallery/reception-exterior.jpg";

const unique = [...fromFolders, ...roomShots].filter(
  (image, index, all) =>
    !DUPLICATES.has(image.src) &&
    all.findIndex((other) => other.src === image.src) === index,
);

export const gallery: GalleryImage[] = unique.sort(
  (a, b) =>
    order.indexOf(a.category) - order.indexOf(b.category) ||
    Number(b.src === FIRST) - Number(a.src === FIRST),
);

export const galleryCategories: GalleryCategory[] = order.filter((category) =>
  gallery.some((image) => image.category === category),
);
