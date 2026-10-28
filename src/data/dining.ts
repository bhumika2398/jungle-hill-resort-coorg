import { photos } from "@/lib/images";
import type { DiningInfo } from "@/types";

export const dining: DiningInfo = {
  intro:
    "Welcome to our in-house restaurant, designed to offer a relaxing dining experience amidst nature. Enjoy freshly prepared meals in a calm and comfortable setting, perfect for families and couples.",
  cuisines: ["South Indian", "North Indian", "Chinese"],
  opens: "7:00 AM",
  closes: "10:00 PM",
  hours: "7:00 AM to 10:00 PM",
  meals: [
    { name: "Breakfast", time: "8:00 AM – 10:00 AM" },
    { name: "Lunch", time: "12:00 PM – 3:00 PM" },
    { name: "Evening Snacks & Tea/Coffee", time: "3:00 PM – 7:00 PM" },
    { name: "Dinner", time: "7:00 PM – 10:00 PM" },
  ],
  guidelines: [
    "Guests are requested to place food orders at least 30–40 minutes in advance.",
    "Last order will be accepted until 9:30 PM.",
    "Outside food is not permitted inside the restaurant or property premises.",
    "Alcohol consumption is not allowed in the restaurant or common areas. Guests may consume alcohol on their own balcony only.",
  ],
  images: photos("/images/dining", [
    [
      "restaurant-hall-01.jpg",
      "Restaurant hall with dark wood tables and a view into the plantation",
    ],
    [
      "restaurant-hall-02.jpg",
      "Restaurant seating under a high timber roof with bamboo blinds",
    ],
  ]),
};
