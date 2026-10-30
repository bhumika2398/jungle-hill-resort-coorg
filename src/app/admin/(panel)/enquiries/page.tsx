import type { Metadata } from "next";
import Link from "next/link";
import { STATUSES, STATUS_LABEL, formatDate, isStatus } from "@/lib/admin/enquiries";
import { PAGE_SIZE, listEnquiries } from "@/lib/admin/queries";
import { StatusBadge } from "../StatusBadge";

export const metadata: Metadata = { title: "Enquiries" };

interface EnquiriesPageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}

export default async function EnquiriesPage({ searchParams }: EnquiriesPageProps) {
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : undefined;
  const q = params.q?.trim() || undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  let result;
  try {
    result = await listEnquiries({ status, q, page });
  } catch (error) {
    return (
      <p role="alert" className="rounded-[6px] border border-line bg-card p-4 text-small">
        Could not load enquiries (
        {error instanceof Error ? error.message : "unknown error"}).
      </p>
    );
  }

  const pages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const href = (next: { status?: string; page?: number }) => {
    const search = new URLSearchParams();
    const nextStatus = "status" in next ? next.status : status;
    if (nextStatus) search.set("status", nextStatus);
    if (q) search.set("q", q);
    if (next.page && next.page > 1) search.set("page", String(next.page));
    const query = search.toString();
    return `/admin/enquiries${query ? `?${query}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-h3">Enquiries</h1>

      <div className="flex flex-wrap items-center gap-3">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2 text-small">
          {[undefined, ...STATUSES].map((item) => (
            <Link
              key={item ?? "all"}
              href={href({ status: item })}
              aria-current={item === status ? "page" : undefined}
              className={`rounded-full border px-3 py-1 ${
                item === status ? "border-burgundy bg-burgundy text-ivory" : "border-line"
              }`}
            >
              {item ? STATUS_LABEL[item] : "All"}
            </Link>
          ))}
        </nav>
        <form action="/admin/enquiries" className="ml-auto flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Name, email or phone"
            aria-label="Search enquiries"
            className="min-h-11 rounded-[6px] border border-line bg-card px-3 text-small"
          />
          <button
            type="submit"
            className="min-h-11 rounded-[6px] border border-line px-3 text-small"
          >
            Search
          </button>
        </form>
      </div>

      {result.rows.length === 0 ? (
        <p className="text-small">No enquiries match.</p>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-line bg-card">
          <table className="w-full min-w-[40rem] text-left text-small">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Stay dates</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.rows.map((row) => (
                <tr key={row.id} className="hover:bg-olive/10">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${row.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      {row.name}
                    </Link>
                    <span className="block">{row.phone ?? row.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {row.check_in
                      ? `${formatDate(row.check_in)} to ${formatDate(row.check_out)}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {row.adults == null
                      ? "-"
                      : `${row.adults} adults${row.children ? `, ${row.children} children` : ""}`}
                  </td>
                  <td className="px-4 py-3">{formatDate(row.created_at, true)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between text-small">
        <span>
          {result.total} enquir{result.total === 1 ? "y" : "ies"} · page {page} of {pages}
        </span>
        <span className="flex gap-3">
          {page > 1 ? (
            <Link
              href={href({ page: page - 1 })}
              className="underline underline-offset-4"
            >
              Previous
            </Link>
          ) : null}
          {page < pages ? (
            <Link
              href={href({ page: page + 1 })}
              className="underline underline-offset-4"
            >
              Next
            </Link>
          ) : null}
        </span>
      </div>
    </div>
  );
}
