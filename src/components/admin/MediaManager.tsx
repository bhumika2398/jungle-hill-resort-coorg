"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, RefreshCw, Trash2, Upload } from "lucide-react";
import { deleteMedia, updateMediaAlt } from "@/lib/admin/content-actions";
import { formatBytes, type LibraryItem } from "@/lib/admin/content-types";

const btn =
  "inline-flex min-h-9 items-center gap-1.5 rounded-[6px] border border-line bg-card px-2.5 text-small hover:border-burgundy disabled:opacity-40";

export function MediaManager({ library }: { library: LibraryItem[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("all");
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState("all");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();

  const folders = useMemo(
    () => [...new Set(library.map((item) => item.folder))].sort(),
    [library],
  );
  const q = query.trim().toLowerCase();
  const shown = library.filter(
    (item) =>
      (folder === "all" || item.folder === folder) &&
      (usage === "all" ||
        (usage === "used" ? !!item.usedIn?.length : !item.usedIn?.length)) &&
      (!q || `${item.folder} ${item.alt} ${item.url}`.toLowerCase().includes(q)),
  );

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    body.set("folder", "uploads");
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = (await response.json()) as {
        saved?: unknown[];
        failed?: string[];
        error?: string;
      };
      if (!response.ok && !result.saved?.length)
        throw new Error(result.error ?? "Upload failed.");
      setMessage(
        `${result.saved?.length ?? 0} uploaded. Add them to a room or the gallery to show them on the site.` +
          (result.failed?.length
            ? ` Could not upload: ${result.failed.join(", ")}.`
            : ""),
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const remove = (item: LibraryItem) => {
    if (!window.confirm("Delete this file permanently?")) return;
    startTransition(async () => {
      const result = await deleteMedia(item.id);
      setMessage(result.ok ? "Deleted." : (result.error ?? ""));
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
        >
          <Upload size={15} aria-hidden="true" />{" "}
          {uploading ? "Uploading..." : "Upload photos"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Upload photos"
          onChange={(event) => void upload(event.target.files)}
        />
        <select
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          aria-label="Filter by folder"
          className="min-h-9 rounded-[6px] border border-line bg-card px-2 text-small"
        >
          <option value="all">All folders ({library.length})</option>
          {folders.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={usage}
          onChange={(event) => setUsage(event.target.value)}
          aria-label="Filter by use"
          className="min-h-9 rounded-[6px] border border-line bg-card px-2 text-small"
        >
          <option value="all">Used and unused</option>
          <option value="used">Used on the site</option>
          <option value="unused">Not used by a room or gallery</option>
        </select>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          aria-label="Search media"
          className="min-h-9 rounded-[6px] border border-line bg-card px-3 text-small"
        />
        <p role="status" className="text-small">
          {message}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => (
          <MediaCard
            key={`${item.id}-${item.url}`}
            item={item}
            onDelete={() => remove(item)}
          />
        ))}
      </ul>
      {shown.length === 0 ? <p className="text-small">Nothing matches.</p> : null}
    </div>
  );
}

function MediaCard({ item, onDelete }: { item: LibraryItem; onDelete: () => void }) {
  const router = useRouter();
  const replaceInput = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(item.alt);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const isImage = item.mime.startsWith("image/");
  const usedIn = [...new Set(item.usedIn ?? [])];

  async function replace(file: File | undefined) {
    if (!file) return;
    if (
      usedIn.length &&
      !window.confirm(
        `This photo is used in: ${usedIn.join(", ")}. Replacing it changes it everywhere. Continue?`,
      )
    ) {
      if (replaceInput.current) replaceInput.current.value = "";
      return;
    }
    setBusy(true);
    setNote("");
    const body = new FormData();
    body.set("file", file);
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "POST",
        body,
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        updatedPages?: string[];
      };
      if (!response.ok || !result.ok)
        throw new Error(result.error ?? "Could not replace.");
      setNote(
        result.updatedPages?.length
          ? `Replaced in ${result.updatedPages.join(", ")}.`
          : "Picture replaced.",
      );
      router.refresh();
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not replace.");
    } finally {
      setBusy(false);
      if (replaceInput.current) replaceInput.current.value = "";
    }
  }

  return (
    <li className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-card">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={alt || item.folder}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="grid aspect-[4/3] place-items-center bg-olive/10 text-small">
          {item.mime}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <p className="truncate text-[0.75rem] opacity-80" title={item.folder}>
          {item.folder} · {item.width ? `${item.width}×${item.height} · ` : ""}
          {formatBytes(item.size_bytes)}
        </p>
        <p className="text-[0.75rem]">
          {usedIn.length ? (
            <span className="rounded-full bg-olive/20 px-2 py-0.5">
              Used in {usedIn.join(", ")}
            </span>
          ) : (
            <span className="opacity-70">Not used by a room or the gallery</span>
          )}
        </p>
        {isImage ? (
          <input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            onBlur={() => {
              if (alt === item.alt) return;
              void updateMediaAlt(item.id, alt).then((result) =>
                setNote(result.ok ? "Description saved" : (result.error ?? "")),
              );
            }}
            placeholder="Description (alt text)"
            aria-label="Description"
            maxLength={300}
            className="min-h-9 w-full rounded-[6px] border border-line bg-surface px-2 text-small"
          />
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={btn}
            onClick={() =>
              void navigator.clipboard
                ?.writeText(item.url)
                .then(() => setNote("Link copied"))
            }
          >
            <Copy size={14} aria-hidden="true" /> Link
          </button>
          {isImage ? (
            <>
              <button
                type="button"
                className={btn}
                onClick={() => replaceInput.current?.click()}
                disabled={busy}
              >
                <RefreshCw size={14} aria-hidden="true" />{" "}
                {busy ? "Replacing..." : "Replace"}
              </button>
              <input
                ref={replaceInput}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-label="Choose a replacement picture"
                onChange={(event) => void replace(event.target.files?.[0])}
              />
            </>
          ) : null}
          <button
            type="button"
            className={btn}
            onClick={onDelete}
            aria-label="Delete file"
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </div>
        <p role="status" className="min-h-4 text-[0.75rem]">
          {note}
        </p>
      </div>
    </li>
  );
}
