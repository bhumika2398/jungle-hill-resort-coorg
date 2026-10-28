"use client";

import { useEffect, useState, useTransition } from "react";
import { resetRoomContent, saveRoomContent } from "@/lib/admin/content-actions";
import { clearNew, type EditorItem, type LibraryItem } from "@/lib/admin/content-types";
import { ImageListEditor } from "./ImageListEditor";

interface RoomEditorProps {
  slug: string;
  initialPrice: number | null;
  initialItems: EditorItem[];
  customised: boolean;
  library: LibraryItem[];
}

const snapshot = (price: string, items: EditorItem[]) =>
  JSON.stringify({
    price: price.trim(),
    items: items.map(({ src, alt }) => ({ src, alt })),
  });

export function RoomEditor({
  slug,
  initialPrice,
  initialItems,
  customised,
  library,
}: RoomEditorProps) {
  const [price, setPrice] = useState(initialPrice ? String(initialPrice) : "");
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState(() =>
    snapshot(initialPrice ? String(initialPrice) : "", initialItems),
  );
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const dirty = snapshot(price, items) !== saved;
  const missing = items.some((item) => !item.alt.trim());

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = () => {
    if (missing) {
      setStatus("Add a description to every photo first.");
      return;
    }
    startTransition(async () => {
      setStatus("");
      const result = await saveRoomContent(slug, price, items);
      if (result.ok) {
        setItems((current) => clearNew(current));
        setSaved(snapshot(price, items));
        setStatus("Saved. The public site shows it from the next visit.");
      } else {
        setStatus(result.error ?? "Could not save.");
      }
    });
  };
  const reset = () => {
    if (
      !window.confirm("Remove your changes and go back to the original price and photos?")
    )
      return;
    startTransition(async () => {
      const result = await resetRoomContent(slug);
      setStatus(
        result.ok ? "Reset. Reload to see the original photos." : (result.error ?? ""),
      );
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[10px] border border-line bg-card p-5">
        <h2 className="font-display text-h4">Price per night</h2>
        <p className="mt-1 text-small">
          Shown on the site as “From ₹X per night”. Leave empty to show “Enquire for
          rates”.
        </p>
        <label className="mt-3 flex max-w-xs items-center gap-2 text-small">
          <span aria-hidden="true">₹</span>
          <input
            inputMode="numeric"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="e.g. 4500"
            aria-label="Price per night in rupees"
            className="min-h-11 w-full rounded-[6px] border border-line bg-surface px-3"
          />
        </label>
      </section>

      <section>
        <h2 className="font-display text-h4">Photos</h2>
        <p className="mt-1 mb-3 text-small">
          Click a photo to edit its description, replace the picture, move or remove it.
          The first photo is the cover.
        </p>
        <ImageListEditor
          items={items}
          onChange={setItems}
          library={library}
          uploadFolder={`uploads/rooms/${slug}`}
          firstIsCover
        />
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
