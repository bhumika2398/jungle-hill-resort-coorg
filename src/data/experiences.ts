import { compact, photo } from "@/lib/images";
import type { Experience } from "@/types";

const g = "/images/gallery";

const shots = (items: [file: string, alt: string][]) =>
  compact(items.map(([file, alt]) => photo(`${g}/${file}`, alt)));

export const experiences: Experience[] = [
  {
    slug: "swimming-pool",
    title: "Swimming pool",
    label: "Pool",
    summary:
      "An open pool set among palms and plantation, with a shallow section for children.",
    facts: [
      "7:00 AM to 7:00 PM",
      "Maximum depth 4.7 ft",
      "Kids pool depth 2.5 ft",
      "Swimwear or nylon dresses only",
      "No food or drinks in the pool area",
    ],
    images: shots([
      [
        "pool-with-kids-pool.jpg",
        "Swimming pool and shallow kids pool on a tiled deck with chairs",
      ],
      ["pool-palms.jpg", "Blue swimming pool with palms and banana plants behind"],
      ["pool-long-view.jpg", "Long view of the pool and its shallow kids section"],
      ["pool-deck-kids-pool.jpg", "Pool deck with chairs and the stepped kids pool"],
      [
        "pool-kids-pool-float.jpg",
        "Kids pool with an inflatable ring beside the main pool",
      ],
      [
        "pool-deck-float.jpg",
        "Pool and tiled deck with an inflatable ring floating in the water",
      ],
      ["pool-water-closeup.jpg", "Pool water and blue tiles with palms behind"],
    ]),
  },
  {
    slug: "kids-park",
    title: "Kids park",
    label: "Kids",
    summary:
      "A safe, child-friendly open play area amid the trees: see-saw, giraffe slide, swings and more.",
    facts: ["For children under 10"],
    images: shots([
      [
        "kids-park-sign-play.jpg",
        "Kids Park sign with climbing frame and slide among the trees",
      ],
    ]),
  },
  {
    slug: "indoor-games",
    title: "Indoor games",
    label: "Indoor",
    summary: "Carrom, table tennis, ludo, chess and foosball.",
    facts: ["Carrom", "Table tennis", "Ludo", "Chess", "Foosball"],
    images: shots([
      ["games-foosball.jpg", "Foosball table with red and blue players"],
      ["games-table-tennis.jpg", "Blue table-tennis table under a roof among trees"],
      ["games-carrom.jpg", "Carrom board with coins and a striker"],
    ]),
  },
  {
    slug: "outdoor-games",
    title: "Outdoor games",
    label: "Outdoor",
    summary: "Shuttle badminton, played within the property premises.",
    facts: [],
    images: [],
  },
];
