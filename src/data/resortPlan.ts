import { photo } from "@/lib/images";
import type { ImageAsset } from "@/types";

export interface PlanMarker {
  id: number;
  label: string;
  note: string;
  /** Position in the plan viewBox (see PLAN_VIEWBOX). */
  x: number;
  y: number;
  kind: "building" | "amenity" | "pool";
  /** Stays link to their page from the legend. */
  href?: string;
  image: ImageAsset | null;
  /** The name written beside the marker on the map, as on the sketch (one string per line). */
  mapLabel: string[];
  /** Offset of the label from the marker, and which side of the text sits at that point. */
  labelDx: number;
  labelDy: number;
  labelAnchor: "start" | "middle" | "end";
}

export const PLAN_VIEWBOX = { width: 640, height: 820 } as const;

/**
 * The client's hand-drawn sketch (docs/resort-map-sketch.png) was traced point by point in its own
 * pixel coordinates. `at` moves a sketch point into the plan's viewBox, so the shapes, the order of
 * the branches and the distances between them stay exactly as drawn.
 */
const at = (sx: number, sy: number) => ({ x: sx - 90, y: sy - 340 });

type Pt = [number, number];

/** A smooth curve through sketch points (Catmull-Rom turned into cubic Béziers). */
function curve(points: Pt[]): string {
  const pts = points.map(([x, y]) => at(x, y));
  const f = (n: number) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

/**
 * The paths as drawn on the sketch, bottom to top: the main road from the Main Gate winds up past
 * Reception to the big fork, then on past the Kids Park turning to the Deluxe AC rooms. Branches:
 * the Swimming Pool just above the gate; at the fork the Restaurant to the left (with the Indoor
 * Games spur above it) and the Family and Standard rooms to the upper right, with the cottage stub.
 * `delay` staggers the drawing.
 */
export const planPaths: { d: string; width: number; delay: number }[] = [
  // main road: Main Gate, Reception, the fork, the Kids Park turning, the Deluxe AC rooms
  {
    d: curve([
      [415, 1135],
      [392, 1112],
      [366, 1075],
      [353, 1030],
      [352, 990],
      [372, 950],
      [420, 915],
      [478, 880],
      [505, 835],
      [498, 795],
      [490, 768],
      [468, 722],
      [430, 672],
      [385, 634],
      [325, 617],
      [250, 620],
      [212, 588],
      [196, 535],
      [205, 478],
      [245, 432],
      [305, 405],
      [372, 375],
    ]),
    width: 8,
    delay: 0,
  },
  // Reception: the short mark at the left of the road
  {
    d: curve([
      [352, 988],
      [332, 986],
    ]),
    width: 5,
    delay: 0.25,
  },
  // Swimming Pool: a branch to the right just above the gate
  {
    d: curve([
      [362, 1022],
      [385, 1002],
      [425, 993],
      [465, 990],
    ]),
    width: 6,
    delay: 0.3,
  },
  // Restaurant: left from the fork, with the Indoor Games spur rising from its end
  {
    d: curve([
      [490, 768],
      [430, 780],
      [370, 790],
      [318, 797],
    ]),
    width: 6,
    delay: 0.5,
  },
  {
    d: curve([
      [318, 797],
      [300, 765],
      [280, 730],
    ]),
    width: 5,
    delay: 0.6,
  },
  // Family and Standard rooms: up and to the right from the fork, then the cottage stub
  {
    d: curve([
      [490, 768],
      [520, 730],
      [545, 705],
      [568, 686],
    ]),
    width: 6,
    delay: 0.55,
  },
  {
    d: curve([
      [556, 682],
      [548, 668],
      [548, 640],
    ]),
    width: 4,
    delay: 0.7,
  },
  // Kids Park: a branch to the left at the top of the first bend
  {
    d: curve([
      [250, 620],
      [222, 640],
      [190, 665],
    ]),
    width: 6,
    delay: 0.75,
  },
];

// TODO: this traces the client's sketch but is still a schematic, NOT surveyed. Replace the traced
// points (and the marker positions below) with a real plan or satellite screenshot when supplied.
// No distances are claimed. Numbers run along the road from the entry (bottom) to the top.
export const planMarkers: PlanMarker[] = [
  {
    id: 1,
    label: "Main Gate",
    note: "The way in, from the road",
    x: 325,
    y: 795,
    mapLabel: ["Main Gate"],
    labelDx: 30,
    labelDy: 5,
    labelAnchor: "start",
    kind: "amenity",
    image: photo(
      "/images/gallery/grounds-driveway-palms.jpg",
      "Red paver driveway with palms and a room block beside it",
    ),
  },
  {
    id: 2,
    label: "Reception",
    note: "Check-in 12 PM, check-out 11 AM",
    x: 260,
    y: 645,
    mapLabel: ["Reception"],
    labelDx: -30,
    labelDy: 5,
    labelAnchor: "end",
    kind: "building",
    image: photo(
      "/images/gallery/reception-exterior.jpg",
      "Reception building with a red roof beside the paver drive",
    ),
  },
  {
    id: 3,
    label: "Swimming Pool",
    note: "7 AM to 7 PM, max depth 4.7 ft",
    x: 375,
    y: 650,
    mapLabel: ["Swimming Pool"],
    labelDx: 30,
    labelDy: 5,
    labelAnchor: "start",
    kind: "pool",
    image: photo(
      "/images/gallery/pool-with-kids-pool.jpg",
      "Swimming pool and shallow kids pool on a tiled deck with chairs",
    ),
  },
  {
    id: 4,
    label: "Restaurant",
    note: "7 AM to 10 PM",
    x: 228,
    y: 457,
    mapLabel: ["Restaurant"],
    labelDx: 0,
    labelDy: 42,
    labelAnchor: "middle",
    kind: "building",
    image: photo(
      "/images/gallery/dining-restaurant-entrance.jpg",
      "Restaurant entrance framed by coffee plants",
    ),
  },
  {
    id: 5,
    label: "Indoor Games",
    note: "Carrom, table tennis, ludo, chess and foosball",
    x: 190,
    y: 390,
    mapLabel: ["Indoor", "Games"],
    labelDx: -30,
    labelDy: -2,
    labelAnchor: "end",
    kind: "amenity",
    image: photo(
      "/images/gallery/games-table-tennis.jpg",
      "Blue table-tennis table under a roof among trees",
    ),
  },
  {
    id: 6,
    label: "Family Rooms (The Estate House)",
    note: "Family AC, ground and first floor",
    href: "/rooms/family-ac-room",
    x: 478,
    y: 346,
    mapLabel: ["Family Rooms &", "Standard Rooms"],
    labelDx: 30,
    labelDy: 2,
    labelAnchor: "start",
    kind: "building",
    image: photo(
      "/images/rooms/family-ac-room/seating-01.jpg",
      "Family AC room seating area",
    ),
  },
  {
    id: 7,
    label: "Standard Non-AC Rooms",
    note: "Rooms A2, A3, A5 upstairs, A6 on the ground floor",
    href: "/rooms/standard-non-ac-room",
    x: 444,
    y: 374,
    mapLabel: [],
    labelDx: 0,
    labelDy: 0,
    labelAnchor: "middle",
    kind: "building",
    image: photo(
      "/images/rooms/standard-non-ac-room/entrance-a6.jpg",
      "Entrance to room A6 with two chairs on a stone floor",
    ),
  },
  {
    id: 8,
    label: "Kids Park",
    note: "For children under 10",
    x: 100,
    y: 325,
    mapLabel: ["Kids Park"],
    labelDx: -30,
    labelDy: 5,
    labelAnchor: "end",
    kind: "amenity",
    image: photo(
      "/images/gallery/kids-park-sign-play.jpg",
      "Kids Park sign with climbing frame and slide",
    ),
  },
  {
    id: 9,
    label: "Deluxe AC Rooms (The Cloudline Suite)",
    note: "Deluxe AC rooms with private balconies",
    href: "/rooms/deluxe-ac-rooms",
    x: 282,
    y: 35,
    mapLabel: ["Deluxe AC Rooms"],
    labelDx: 30,
    labelDy: 5,
    labelAnchor: "start",
    kind: "building",
    image: photo(
      "/images/rooms/deluxe-ac-rooms/exterior-01.jpg",
      "Deluxe block with balconies among tall trees",
    ),
  },
  // The sketch shows the Standard Non-AC cottage as the short stub above the Family and Standard rooms.
  {
    id: 10,
    label: "Standard Non-AC Cottage (The Pepper Vine Cottage)",
    note: "Standard Non-AC Cottage",
    href: "/rooms/standard-non-ac-cottage",
    x: 458,
    y: 300,
    mapLabel: ["Standard Non-AC", "Cottage"],
    labelDx: 0,
    labelDy: -40,
    labelAnchor: "middle",
    kind: "building",
    image: photo(
      "/images/rooms/standard-non-ac-cottage/exterior-02.jpg",
      "Cottage with a red tiled roof among bamboo",
    ),
  },
];

export const gettingHere = [
  { label: "Madikeri", detail: "Start" },
  { label: "5 km", detail: "towards Virajpet" },
  { label: "Jungle Hill Resort", detail: "Mekeri Village" },
  { label: "Virajpet", detail: "Further along the road" },
];
