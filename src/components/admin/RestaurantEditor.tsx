"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  resetRestaurantContent,
  saveRestaurantContent,
} from "@/lib/admin/content-actions";
import type { RestaurantInput } from "@/lib/admin/content-types";

const field =
  "mt-1 block min-h-11 w-full rounded-[6px] border border-line bg-surface px-3 text-small focus:border-burgundy focus:outline-none";
const iconBtn =
  "grid h-10 w-10 shrink-0 place-items-center rounded-[6px] border border-line bg-card hover:border-burgundy disabled:opacity-40";
const addBtn =
  "inline-flex min-h-10 items-center gap-1.5 rounded-[6px] border border-line bg-card px-3 text-small hover:border-burgundy";

function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}

interface RestaurantEditorProps {
  initial: RestaurantInput;
  customised: boolean;
}

export function RestaurantEditor({ initial, customised }: RestaurantEditorProps) {
  const [data, setData] = useState<RestaurantInput>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(data) !== saved;
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof RestaurantInput>(key: K, value: RestaurantInput[K]) =>
    setData((current) => ({ ...current, [key]: value }));

  const save = () =>
    startTransition(async () => {
      setStatus("");
      const result = await saveRestaurantContent(data);
      if (result.ok) {
        setSaved(JSON.stringify(data));
        setStatus("Saved. The site shows it from the next visit.");
      } else {
        setStatus(result.error ?? "Could not save.");
      }
    });

  const reset = () => {
    if (
      !window.confirm("Remove your changes and go back to the original restaurant text?")
    )
      return;
    startTransition(async () => {
      const result = await resetRestaurantContent();
      setStatus(
        result.ok
          ? "Reset. Reload this page to see the original text."
          : (result.error ?? ""),
      );
    });
  };

  const card = "rounded-[10px] border border-line bg-card p-5";

  return (
    <div className="space-y-6">
      <section className={card}>
        <h2 className="font-display text-h4">Welcome text</h2>
        <p className="mt-1 text-small">Shown under the heading on the Restaurant page.</p>
        <label className="mt-3 block text-small">
          <span className="sr-only">Welcome paragraph</span>
          <textarea
            value={data.intro}
            onChange={(event) => set("intro", event.target.value)}
            rows={4}
            maxLength={700}
            className={`${field} py-2`}
          />
        </label>
      </section>

      <section className={card}>
        <h2 className="font-display text-h4">Opening hours</h2>
        <p className="mt-1 text-small">
          Written as guests should read them, for example “7:00 AM”. Also used on the
          About page, the FAQ and in search results.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-small">
            Opening time
            <input
              value={data.opens}
              onChange={(event) => set("opens", event.target.value)}
              maxLength={20}
              placeholder="7:00 AM"
              className={field}
            />
          </label>
          <label className="block text-small">
            Closing time
            <input
              value={data.closes}
              onChange={(event) => set("closes", event.target.value)}
              maxLength={20}
              placeholder="10:00 PM"
              className={field}
            />
          </label>
        </div>
      </section>

      <section className={card}>
        <h2 className="font-display text-h4">Meal timings</h2>
        <ul className="mt-3 space-y-3">
          {data.meals.map((meal, index) => (
            <li
              key={index}
              className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
            >
              <label className="block text-small">
                Meal
                <input
                  value={meal.name}
                  onChange={(event) =>
                    set(
                      "meals",
                      data.meals.map((m, i) =>
                        i === index ? { ...m, name: event.target.value } : m,
                      ),
                    )
                  }
                  maxLength={60}
                  className={field}
                />
              </label>
              <label className="block text-small">
                Time
                <input
                  value={meal.time}
                  onChange={(event) =>
                    set(
                      "meals",
                      data.meals.map((m, i) =>
                        i === index ? { ...m, time: event.target.value } : m,
                      ),
                    )
                  }
                  maxLength={40}
                  placeholder="8:00 AM – 10:00 AM"
                  className={field}
                />
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => set("meals", move(data.meals, index, -1))}
                >
                  <ArrowUp size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Move down"
                  disabled={index === data.meals.length - 1}
                  onClick={() => set("meals", move(data.meals, index, 1))}
                >
                  <ArrowDown size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Remove meal"
                  onClick={() =>
                    set(
                      "meals",
                      data.meals.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${addBtn} mt-3`}
          disabled={data.meals.length >= 10}
          onClick={() => set("meals", [...data.meals, { name: "", time: "" }])}
        >
          <Plus size={15} aria-hidden="true" /> Add a meal
        </button>
      </section>

      <section className={card}>
        <h2 className="font-display text-h4">Important guidelines</h2>
        <p className="mt-1 text-small">
          One rule per line item. Shown as a list on the Restaurant page.
        </p>
        <ul className="mt-3 space-y-3">
          {data.guidelines.map((rule, index) => (
            <li key={index} className="flex items-start gap-2">
              <label className="block flex-1 text-small">
                <span className="sr-only">Guideline {index + 1}</span>
                <textarea
                  value={rule}
                  onChange={(event) =>
                    set(
                      "guidelines",
                      data.guidelines.map((g, i) =>
                        i === index ? event.target.value : g,
                      ),
                    )
                  }
                  rows={2}
                  maxLength={300}
                  className={`${field} mt-0 py-2`}
                />
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => set("guidelines", move(data.guidelines, index, -1))}
                >
                  <ArrowUp size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Move down"
                  disabled={index === data.guidelines.length - 1}
                  onClick={() => set("guidelines", move(data.guidelines, index, 1))}
                >
                  <ArrowDown size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  aria-label="Remove guideline"
                  onClick={() =>
                    set(
                      "guidelines",
                      data.guidelines.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${addBtn} mt-3`}
          disabled={data.guidelines.length >= 12}
          onClick={() => set("guidelines", [...data.guidelines, ""])}
        >
          <Plus size={15} aria-hidden="true" /> Add a guideline
        </button>
      </section>

      <section className={card}>
        <h2 className="font-display text-h4">Cuisines</h2>
        <p className="mt-1 text-small">
          Shown as tags on the Restaurant page and in search results.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {data.cuisines.map((cuisine, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <input
                value={cuisine}
                onChange={(event) =>
                  set(
                    "cuisines",
                    data.cuisines.map((c, i) => (i === index ? event.target.value : c)),
                  )
                }
                aria-label={`Cuisine ${index + 1}`}
                maxLength={40}
                className="min-h-10 w-40 rounded-[6px] border border-line bg-surface px-3 text-small"
              />
              <button
                type="button"
                className={iconBtn}
                aria-label="Remove cuisine"
                onClick={() =>
                  set(
                    "cuisines",
                    data.cuisines.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${addBtn} mt-3`}
          disabled={data.cuisines.length >= 8}
          onClick={() => set("cuisines", [...data.cuisines, ""])}
        >
          <Plus size={15} aria-hidden="true" /> Add a cuisine
        </button>
      </section>

      <div className="sticky bottom-0 z-20 -mx-1 flex flex-wrap items-center gap-3 border-t border-line bg-surface/95 px-1 py-3 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="min-h-11 rounded-[6px] bg-burgundy px-5 text-small text-ivory disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
        {customised ? (
          <button
            type="button"
            onClick={reset}
            disabled={pending}
            className="min-h-11 rounded-[6px] border border-line px-4 text-small"
          >
            Reset to original
          </button>
        ) : null}
        <p role="status" className="text-small">
          {dirty && !status ? "You have unsaved changes." : status}
        </p>
      </div>
    </div>
  );
}
