"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Pencil,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { EditorItem, LibraryItem } from "@/lib/admin/content-types";

interface ImageListEditorProps {
  items: EditorItem[];
  onChange: (items: EditorItem[]) => void;
  library: LibraryItem[];
  /** Gallery only: lets each photo be filed under a category. */
  categories?: readonly string[];
  /** Folder new uploads are filed under. */
  uploadFolder: string;
  /** Rooms: the first photo is the cover shown on cards. */
  firstIsCover?: boolean;
}

const btn =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[6px] border border-line bg-card px-3 text-small hover:border-burgundy disabled:opacity-40";
const field =
  "mt-1 block min-h-11 w-full rounded-[6px] border border-line bg-surface px-3 text-small focus:border-burgundy focus:outline-none";

/**
 * Photo grid with a side panel for editing one photo at a time: description, category, replace the
 * picture, reorder, remove. New uploads are flagged until saved and open the panel so each gets a
 * description straight away.
 */
export function ImageListEditor({
  items,
  onChange,
  library,
  categories,
  uploadFolder,
  firstIsCover = false,
}: ImageListEditorProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [picker, setPicker] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const used = useMemo(() => new Set(items.map((item) => item.src)), [items]);
  const current = selected !== null ? items[selected] : undefined;

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const patch = (index: number, change: Partial<EditorItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...change } : item)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
    setSelected(target);
  };

  const remove = (index: number) => {
    if (
      !window.confirm("Remove this photo from here? The file stays in the media library.")
    )
      return;
    onChange(items.filter((_, i) => i !== index));
    setSelected(null);
  };

  async function upload(files: File[], target?: { replace: number }) {
    if (!files.length) return;
    setBusy(true);
    setMessage("");
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    body.set("folder", uploadFolder);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = (await response.json()) as {
        saved?: LibraryItem[];
        failed?: string[];
        error?: string;
      };
      const saved = result.saved ?? [];
      if (!saved.length)
        throw new Error(
          result.error ?? "Upload failed. Use JPG, PNG or WebP under 15 MB.",
        );

      if (target) {
        // Keep the description, category and position; only the picture changes.
        patch(target.replace, { src: saved[0]!.url });
        setMessage("Picture replaced. Save to publish it.");
      } else {
        const firstNew = items.length;
        onChange([
          ...items,
          ...saved.map((photo) => ({
            src: photo.url,
            alt: "",
            isNew: true,
            ...(categories ? { category: categories[0] } : {}),
          })),
        ]);
        setSelected(firstNew);
        setFilter("All");
        setMessage(
          `${saved.length} photo${saved.length === 1 ? "" : "s"} uploaded. Add a description for each, then save.` +
            (result.failed?.length
              ? ` Could not upload: ${result.failed.join(", ")}.`
              : ""),
        );
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (addInput.current) addInput.current.value = "";
      if (replaceInput.current) replaceInput.current.value = "";
    }
  }

  const addFromLibrary = (photo: LibraryItem) => {
    const index = items.length;
    onChange([
      ...items,
      {
        src: photo.url,
        alt: photo.alt,
        isNew: true,
        ...(categories ? { category: categories[0] } : {}),
      },
    ]);
    setSelected(index);
  };

  const q = query.trim().toLowerCase();
  const results = library
    .filter((photo) => photo.mime.startsWith("image/"))
    .filter((photo) => !q || `${photo.folder} ${photo.alt}`.toLowerCase().includes(q))
    .slice(0, 60);

  const missing = items.filter((item) => !item.alt.trim()).length;
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => filter === "All" || item.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => addInput.current?.click()}
          disabled={busy}
        >
          <Upload size={15} aria-hidden="true" />{" "}
          {busy ? "Working..." : "Upload new photos"}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => setPicker((open) => !open)}
          aria-expanded={picker}
        >
          <ImagePlus size={15} aria-hidden="true" />{" "}
          {picker ? "Close library" : "Add from library"}
        </button>
        <input
          ref={addInput}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Upload new photos"
          onChange={(event) => void upload(Array.from(event.target.files ?? []))}
        />
        <p role="status" className="text-small">
          {message}
        </p>
      </div>

      {missing > 0 ? (
        <p className="flex items-center gap-2 text-small font-medium">
          <AlertCircle size={16} aria-hidden="true" />
          {missing} photo{missing === 1 ? " needs" : "s need"} a description before you
          can save.
        </p>
      ) : null}

      {categories ? (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {["All", ...categories].map((name) => {
            const count =
              name === "All"
                ? items.length
                : items.filter((item) => item.category === name).length;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={filter === name}
                className={`rounded-full border px-3 py-1 text-small ${
                  filter === name
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-line bg-card"
                }`}
              >
                {name} <span className="opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {picker ? (
        <div className="rounded-[10px] border border-line bg-card p-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by folder or description"
            aria-label="Search the media library"
            className="mb-3 min-h-10 w-full rounded-[6px] border border-line bg-surface px-3 text-small"
          />
          <ul className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 lg:grid-cols-6">
            {results.map((photo) => (
              <li key={photo.id}>
                <button
                  type="button"
                  onClick={() => addFromLibrary(photo)}
                  disabled={used.has(photo.url)}
                  className="relative block w-full overflow-hidden rounded-[6px] border border-line disabled:opacity-40"
                  title={photo.folder}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt || photo.folder}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 truncate bg-burgundy/80 px-1 py-0.5 text-[0.7rem] text-ivory">
                    {used.has(photo.url)
                      ? "Already added"
                      : photo.folder.replace(/^images\//, "")}
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="col-span-full text-small">No photos match.</li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {visible.map(({ item, index }) => (
          <li key={`${item.src}-${index}`}>
            <div
              className={`group relative overflow-hidden rounded-[10px] border bg-card ${
                selected === index
                  ? "border-burgundy ring-2 ring-burgundy"
                  : "border-line"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(index)}
                className="block w-full text-left"
                aria-label={`Edit photo ${index + 1}: ${item.alt || "no description yet"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <span className="block truncate px-2.5 py-2 text-small">
                  {item.alt || <span className="font-medium">Add a description</span>}
                </span>
              </button>
              <div className="pointer-events-none absolute top-2 left-2 flex flex-wrap gap-1">
                {firstIsCover && index === 0 ? (
                  <span className="rounded-full bg-burgundy px-2 py-0.5 text-[0.7rem] text-ivory">
                    Cover
                  </span>
                ) : null}
                {item.isNew ? (
                  <span className="rounded-full bg-olive px-2 py-0.5 text-[0.7rem] text-ivory">
                    New
                  </span>
                ) : null}
                {!item.alt.trim() ? (
                  <span className="rounded-full border border-burgundy bg-card px-2 py-0.5 text-[0.7rem]">
                    Needs description
                  </span>
                ) : null}
              </div>
              {categories ? (
                <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-card/90 px-2 py-0.5 text-[0.7rem]">
                  {item.category}
                </span>
              ) : null}
              <span className="pointer-events-none absolute right-2 bottom-12 grid h-8 w-8 place-items-center rounded-full bg-burgundy text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                <Pencil size={14} aria-hidden="true" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      {visible.length === 0 ? (
        <p className="text-small">
          {items.length === 0
            ? "No photos yet. Upload new photos or add from the library."
            : "No photos in this category."}
        </p>
      ) : null}

      {current !== undefined && selected !== null ? (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Edit photo"
        >
          <button
            type="button"
            aria-label="Close editor"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-burgundy/40"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto border-l border-line bg-surface sm:w-[27rem]">
            <div className="flex items-center justify-between border-b border-line bg-card px-4 py-3">
              <h3 className="font-display text-h4 leading-none">
                Photo {selected + 1} of {items.length}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="grid h-10 w-10 place-items-center rounded-[6px] border border-line"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-[10px] border border-line bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.src}
                  alt={current.alt || "Preview"}
                  className="max-h-72 w-full object-contain"
                />
              </div>

              <label className="block text-small">
                Description (alt text) <span aria-hidden="true">*</span>
                <input
                  value={current.alt}
                  maxLength={300}
                  autoFocus={!!current.isNew}
                  onChange={(event) => patch(selected, { alt: event.target.value })}
                  placeholder="Describe what the photo shows"
                  aria-invalid={!current.alt.trim()}
                  className={field}
                />
                <span className="mt-1 block text-[0.8rem] opacity-75">
                  Read aloud to screen-reader users and shown if the image cannot load.
                </span>
              </label>

              {categories ? (
                <label className="block text-small">
                  Category
                  <select
                    value={current.category ?? categories[0]}
                    onChange={(event) =>
                      patch(selected, { category: event.target.value })
                    }
                    className={field}
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={btn}
                  onClick={() => replaceInput.current?.click()}
                  disabled={busy}
                >
                  <RefreshCw size={15} aria-hidden="true" />{" "}
                  {busy ? "Working..." : "Replace picture"}
                </button>
                <button type="button" className={btn} onClick={() => remove(selected)}>
                  <Trash2 size={15} aria-hidden="true" /> Remove
                </button>
                <button
                  type="button"
                  className={btn}
                  onClick={() => move(selected, -1)}
                  disabled={selected === 0}
                >
                  <ArrowLeft size={15} aria-hidden="true" /> Move earlier
                </button>
                <button
                  type="button"
                  className={btn}
                  onClick={() => move(selected, 1)}
                  disabled={selected === items.length - 1}
                >
                  Move later <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
              <input
                ref={replaceInput}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Choose a replacement picture"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload([file], { replace: selected });
                }}
              />
              <p role="status" className="text-small">
                {message}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="min-h-11 w-full rounded-[6px] bg-burgundy px-4 text-small text-ivory"
              >
                Done
              </button>
              <p className="text-[0.8rem] opacity-75">
                Changes apply to the site after you press Save on the page.
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
