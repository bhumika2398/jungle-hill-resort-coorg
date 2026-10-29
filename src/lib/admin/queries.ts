import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import type { LibraryItem } from "./content-types";
import { usageByPath } from "./media-ops";
import { STATUSES, type EnquiryRow, type EnquiryStatus } from "./enquiries";

export const PAGE_SIZE = 20;

export async function listEnquiries(opts: {
  status?: EnquiryStatus;
  q?: string;
  page: number;
}) {
  let query = createServiceClient()
    .from("enquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((opts.page - 1) * PAGE_SIZE, opts.page * PAGE_SIZE - 1);
  if (opts.status) query = query.eq("status", opts.status);
  // Strip characters that have meaning in a PostgREST filter expression.
  const q = opts.q?.replace(/[%,()*\\]/g, " ").trim();
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as EnquiryRow[], total: count ?? 0 };
}

export async function getEnquiry(id: string) {
  const { data, error } = await createServiceClient()
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as EnquiryRow | null;
}

export async function statusCounts() {
  const supabase = createServiceClient();
  const entries = await Promise.all(
    STATUSES.map(async (status) => {
      const { count, error } = await supabase
        .from("enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      if (error) throw new Error(error.message);
      return [status, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<EnquiryStatus, number>;
}

const LIBRARY_COLUMNS = "id, path, url, alt, folder, mime, width, height, size_bytes";

export async function listMedia(): Promise<LibraryItem[]> {
  const { data, error } = await createServiceClient()
    .from("media")
    .select(LIBRARY_COLUMNS)
    .order("folder", { ascending: true })
    .order("path", { ascending: true })
    .limit(1000);
  if (error) throw new Error(error.message);
  const items = (data ?? []) as LibraryItem[];
  const usage = await usageByPath(items);
  return items.map((item) => ({ ...item, usedIn: usage.get(item.path) ?? [] }));
}

export async function getContentValue<T>(key: string): Promise<T | null> {
  const { data, error } = await createServiceClient()
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.value as T | undefined) ?? null;
}
