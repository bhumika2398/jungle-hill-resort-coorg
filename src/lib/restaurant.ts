import type { DiningInfo } from "@/types";

/** "7:00 AM" -> "7 AM" for compact tiles. */
export function shortTime(time: string) {
  return time.replace(/:00(?=\s?[AP]M)/i, "").trim();
}

/** "7 AM – 10 PM" */
export function shortHours(opens: string, closes: string) {
  return `${shortTime(opens)} – ${shortTime(closes)}`;
}

/** "7:00 AM" or "7 PM" -> "07:00" / "19:00" for schema.org. Returns null if it can't be read. */
export function to24h(time: string): string | null {
  const match = /^\s*(\d{1,2})(?::(\d{2}))?\s*([AP])\.?M\.?\s*$/i.exec(time);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3]!.toUpperCase() === "P") hour += 12;
  const minute = match[2] ?? "00";
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

/** "7:00 AM" -> minutes after midnight (420), or null if it cannot be read. */
export function toMinutes(time: string): number | null {
  const hm = to24h(time);
  if (!hm) return null;
  const [h, m] = hm.split(":").map(Number);
  return h! * 60 + m!;
}

/** "8:00 AM – 10:00 AM" -> [480, 600], or null if either end cannot be read. */
export function parseRange(text: string): [number, number] | null {
  const parts = text.split(/\s*(?:–|—|-|\bto\b)\s*/i);
  if (parts.length !== 2) return null;
  const start = toMinutes(parts[0]!);
  const end = toMinutes(parts[1]!);
  return start === null || end === null ? null : [start, end];
}

/** True when `now` (minutes after midnight) is inside [start, end), including windows that pass midnight. */
export function withinWindow(now: number, start: number, end: number) {
  return end > start ? now >= start && now < end : now >= start || now < end;
}

/** One-sentence answer for the "when is the restaurant open" FAQ, built from the live data. */
export function restaurantFaqAnswer(
  dining: Pick<DiningInfo, "opens" | "closes" | "cuisines">,
) {
  const food = dining.cuisines.length
    ? ` and serves ${dining.cuisines.join(", ")} food`
    : "";
  return `The restaurant is open ${dining.opens} to ${dining.closes}${food}. Meal timings and ordering guidelines are on the Restaurant page.`;
}
