"use client";

import { useEffect, useState, useTransition } from "react";
import { resetGalleryContent, saveGalleryContent } from "@/lib/admin/content-actions";
import {
  GALLERY_CATEGORIES,
  clearNew,
  type EditorItem,
  type LibraryItem,
} from "@/lib/admin/content-types";
import { ImageListEditor } from "./ImageListEditor";

interface GalleryEditorProps {
  initialItems: EditorItem[];
  customised: boolean;
  library: LibraryItem[];
}

const snapshot = (items: EditorItem[]) =>
  JSON.stringify(items.map(({ src, alt, category }) => ({ src, alt, category })));

export function GalleryEditor({ initialItems, customised, library }: GalleryEditorProps) {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState(() => snapshot(initialItems));
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const dirty = snapshot(items) !== saved;
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
      const result = await saveGalleryContent(items);
      if (result.ok) {
        setItems((current) => clearNew(current));
        setSaved(snapshot(items));
        setStatus("Saved. The gallery shows it from the next visit.");
      } else {
        setStatus(result.error ?? "Could not save.");
      }
    });
  };
  const reset = () => {
    if (!window.confirm("Remove your changes and go back to the original gallery?"))
      return;
    startTransition(async () => {
      const result = await resetGalleryContent();
      setStatus(
        result.ok ? "Reset. Reload to see the original gallery." : (result.error ?? ""),
      );
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-small">
        {items.length} photos in the gallery. Click a photo to edit its description or
        category, replace the picture, move it or remove it.
      </p>
      <ImageListEditor
        items={items}
        onChange={setItems}
        library={library}
        categories={GALLERY_CATEGORIES}
        uploadFolder="uploads/gallery"
      />
      <div className="sticky bottom-0 z-20 -mx-1 flex flex-wrap items-center gap-3 border-t border-line bg-surface/95 px-1 py-3 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty}
          className="min-h-11 rounded-[6px] bg-burgundy px-5 text-small text-ivory disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save gallery"}
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
