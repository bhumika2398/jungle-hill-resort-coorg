"use client";

import { useEffect, useState } from "react";
import { Coffee, Moon, Sun, Sunrise, UtensilsCrossed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { parseRange, toMinutes, withinWindow } from "@/lib/restaurant";
import type { MealTime } from "@/types";

interface RestaurantTimingsProps {
  opens: string;
  closes: string;
  meals: MealTime[];
  cuisines: string[];
}

function mealIcon(name: string): LucideIcon {
  if (/breakfast|morning/i.test(name)) return Sunrise;
  if (/lunch|noon/i.test(name)) return Sun;
  if (/snack|tea|coffee/i.test(name)) return Coffee;
  if (/dinner|supper|night/i.test(name)) return Moon;
  return UtensilsCrossed;
}

/** Current time in India, as minutes after midnight. */
function nowInIndia() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/**
 * Opening hours, the meal timetable and cuisines in one card. Shows whether the restaurant is open
 * right now and which meal is being served, using India time. Nothing live is rendered on the server,
 * so the page can stay static and the status appears once the browser knows the time.
 */
export function RestaurantTimings({
  opens,
  closes,
  meals,
  cuisines,
}: RestaurantTimingsProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(nowInIndia());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const openAt = toMinutes(opens);
  const closeAt = toMinutes(closes);
  const isOpen =
    now !== null && openAt !== null && closeAt !== null
      ? withinWindow(now, openAt, closeAt)
      : null;

  return (
    <div className="shadow-soft rounded-[6px] border border-line bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="label-mono opacity-75">Open daily</p>
        <p role="status" className="min-h-8">
          {isOpen === null ? null : (
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-small ${
                isOpen ? "border-olive bg-olive/15" : "border-line"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${isOpen ? "bg-olive" : "bg-burgundy/40"}`}
              />
              {isOpen ? `Open now · until ${closes}` : `Closed now · opens ${opens}`}
            </span>
          )}
        </p>
      </div>

      <p className="mt-2 font-display text-4xl">
        {opens} to {closes}
      </p>

      <ul className="mt-6 space-y-2.5">
        {meals.map((meal) => {
          const Icon = mealIcon(meal.name);
          const range = parseRange(meal.time);
          const serving =
            now !== null && range !== null
              ? withinWindow(now, range[0], range[1])
              : false;
          return (
            <li
              key={meal.name}
              className={`flex items-center gap-3 rounded-[6px] border px-3 py-2.5 transition-colors ${
                serving ? "border-burgundy bg-burgundy/[0.07]" : "border-line"
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                  serving ? "bg-burgundy text-ivory" : "bg-olive/15"
                }`}
              >
                <Icon size={17} strokeWidth={1.6} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block leading-tight">{meal.name}</span>
                <span className="label-mono mt-0.5 block text-[0.68rem] sm:hidden">
                  {meal.time}
                </span>
                {serving ? (
                  <span className="label-mono block text-[0.65rem] whitespace-nowrap text-burgundy">
                    Serving now
                  </span>
                ) : null}
              </span>
              <span className="label-mono hidden shrink-0 text-right sm:block">
                {meal.time}
              </span>
            </li>
          );
        })}
      </ul>

      {cuisines.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Cuisines">
          {cuisines.map((cuisine) => (
            <li
              key={cuisine}
              className="label-mono rounded-full border border-line px-3 py-1.5"
            >
              {cuisine}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
