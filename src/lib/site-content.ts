import "server-only";
import { cache } from "react";
import { dining as staticDining } from "@/data/dining";
import { gallery as staticGallery } from "@/data/gallery";
import { getRoomBySlug, rooms as staticRooms } from "@/data/rooms";
import { CONTENT_TAG, KEYS, TTL, cached } from "@/lib/cache";
import { createContentReadClient } from "@/lib/supabase/server";
import type {
  DiningInfo,
  GalleryCategory,
  GalleryImage,
  ImageAsset,
  MealTime,
  Room,
} from "@/types";

/** Shapes stored in the site_content table (edited from the admin panel). */
export interface RoomContent {
  /** Price per night in INR; null or missing means "enquire for rates". */
  price?: number | null;
  /** When present, replaces the room's photo list. */
  images?: ImageAsset[];
}

export interface GalleryContent {
  images: GalleryImage[];
}

/** Restaurant text edited from the admin panel. Missing or invalid parts fall back to the built-in text. */
export interface RestaurantContent {
  intro?: string;
  opens?: string;
  closes?: string;
  cuisines?: string[];
  meals?: MealTime[];
  guidelines?: string[];
}

export const RESTAURANT_KEY = "restaurant";

export const roomKey = (slug: string) => `room:${slug}`;
export const GALLERY_KEY = "gallery";

export function formatPrice(price: number) {
  return `From ₹${price.toLocaleString("en-IN")} per night`;
}

async function loadAllContent(): Promise<Record<string, unknown>> {
  const { data, error } = await createContentReadClient(CONTENT_TAG)
    .from("site_content")
    .select("key, value");
  if (error) throw error;
  return Object.fromEntries(
    (data ?? []).map((row) => [row.key as string, row.value as unknown]),
  );
}

/** One cached read per render (React cache), shared across servers by Redis when configured. */
const allContent = cache(() => cached(KEYS.content, TTL.content, loadAllContent));

/**
 * Overrides from the cache or Supabase. Any failure (missing env, network, table not created yet)
 * returns an empty map so the public site always falls back to the built-in content.
 */
async function readContent(keys?: string[]) {
  try {
    const all = await allContent();
    const wanted = keys
      ? Object.entries(all).filter(([key]) => keys.includes(key))
      : Object.entries(all);
    return new Map(wanted);
  } catch (error) {
    // Failures are not cached, so the next request retries.
    console.error("site_content unavailable, using built-in content", error);
    return new Map<string, unknown>();
  }
}

export function applyRoomContent(room: Room, content: RoomContent | undefined): Room {
  if (!content) return room;
  const price =
    typeof content.price === "number" && content.price > 0 ? content.price : null;
  const images = content.images?.length ? content.images : room.images;
  return {
    ...room,
    images,
    price,
    rateNote: price ? formatPrice(price) : room.rateNote,
  };
}

export async function getRooms(): Promise<Room[]> {
  const content = await readContent(staticRooms.map((room) => roomKey(room.slug)));
  return staticRooms.map((room) =>
    applyRoomContent(room, content.get(roomKey(room.slug)) as RoomContent | undefined),
  );
}

export async function getRoom(slug: string): Promise<Room | undefined> {
  const base = getRoomBySlug(slug);
  if (!base) return undefined;
  const content = await readContent([roomKey(slug)]);
  return applyRoomContent(base, content.get(roomKey(slug)) as RoomContent | undefined);
}

export async function getGallery(): Promise<GalleryImage[]> {
  const content = await readContent([GALLERY_KEY]);
  const stored = content.get(GALLERY_KEY) as GalleryContent | undefined;
  return stored?.images?.length ? stored.images : staticGallery;
}

const text = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;
const strings = (value: unknown, fallback: string[]) => {
  if (!Array.isArray(value)) return fallback;
  const list = value.filter(
    (item): item is string => typeof item === "string" && !!item.trim(),
  );
  return list.length ? list.map((item) => item.trim()) : fallback;
};

export function applyRestaurantContent(
  base: DiningInfo,
  content: RestaurantContent | undefined,
): DiningInfo {
  if (!content) return base;
  const opens = text(content.opens, base.opens);
  const closes = text(content.closes, base.closes);
  const meals = Array.isArray(content.meals)
    ? content.meals.filter(
        (meal): meal is MealTime =>
          !!meal &&
          typeof meal.name === "string" &&
          typeof meal.time === "string" &&
          !!meal.name.trim(),
      )
    : [];
  return {
    ...base,
    intro: text(content.intro, base.intro),
    opens,
    closes,
    hours: `${opens} to ${closes}`,
    cuisines: strings(content.cuisines, base.cuisines),
    meals: meals.length ? meals : base.meals,
    guidelines: strings(content.guidelines, base.guidelines),
  };
}

export async function getRestaurant(): Promise<DiningInfo> {
  const content = await readContent([RESTAURANT_KEY]);
  return applyRestaurantContent(
    staticDining,
    content.get(RESTAURANT_KEY) as RestaurantContent | undefined,
  );
}

export type { GalleryCategory };
