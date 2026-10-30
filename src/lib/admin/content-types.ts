/** Client-safe shapes shared by the admin image editors and their server actions. */
export interface EditorItem {
  /** Public URL (Supabase) or a /images/... path that ships with the site. */
  src: string;
  alt: string;
  /** Gallery only. */
  category?: string;
  /** Client-only: added in this session and not saved yet. Ignored by the server. */
  isNew?: boolean;
}

export interface LibraryItem {
  id: string;
  path: string;
  url: string;
  alt: string;
  folder: string;
  mime: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  /** Where the site currently uses it, for example "Gallery" or "Deluxe AC Room". */
  usedIn?: string[];
}

export const GALLERY_CATEGORIES = [
  "Reception",
  "Rooms",
  "Pool",
  "Dining",
  "Kids Park",
  "Games",
  "Grounds",
] as const;

export function formatBytes(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Drops the client-only "new" flag once items have been saved. */
export function clearNew(items: EditorItem[]): EditorItem[] {
  return items.map((item) => ({
    src: item.src,
    alt: item.alt,
    ...(item.category ? { category: item.category } : {}),
  }));
}

/** What the Restaurant admin form edits. */
export interface RestaurantInput {
  intro: string;
  opens: string;
  closes: string;
  cuisines: string[];
  meals: { name: string; time: string }[];
  guidelines: string[];
}
