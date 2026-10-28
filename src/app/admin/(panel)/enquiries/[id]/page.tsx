import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/admin/enquiries";
import { getEnquiry } from "@/lib/admin/queries";
import { StatusBadge } from "../../StatusBadge";
import { DeleteButton } from "./DeleteButton";
import { SaveForm } from "./SaveForm";

export const metadata: Metadata = { title: "Enquiry" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface EnquiryPageProps {
  params: Promise<{ id: string }>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[10rem_1fr]">
      <dt className="text-small opacity-80">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  );
}

function show(value: unknown) {
  if (value == null || value === "") return "-";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default async function EnquiryPage({ params }: EnquiryPageProps) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const row = await getEnquiry(id);
  if (!row) notFound();

  const extras = Object.entries(row.details ?? {});

  return (
    <div className="space-y-6">
      <Link href="/admin/enquiries" className="text-small underline underline-offset-4">
        Back to enquiries
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-h3">{row.name}</h1>
        <StatusBadge status={row.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <section
          aria-label="Enquiry details"
          className="rounded-[10px] border border-line bg-card p-5"
        >
          <dl className="divide-y divide-line">
            <Row label="Received">{formatDate(row.created_at, true)}</Row>
            <Row label="Source">
              {row.source === "wizard" ? "Enquiry form" : "Contact form"}
            </Row>
            <Row label="Phone">
              {row.phone ? (
                <a href={`tel:${row.phone}`} className="underline">
                  {row.phone}
                </a>
              ) : (
                "-"
              )}
            </Row>
            <Row label="Email">
              {row.email ? (
                <a href={`mailto:${row.email}`} className="underline">
                  {row.email}
                </a>
              ) : (
                "-"
              )}
            </Row>
            <Row label="Check-in">{formatDate(row.check_in)}</Row>
            <Row label="Check-out">{formatDate(row.check_out)}</Row>
            <Row label="Guests">
              {row.adults == null
                ? "-"
                : `${row.adults} adults, ${row.children ?? 0} children, ${row.infants ?? 0} infants`}
            </Row>
            <Row label="Rooms">{show(row.rooms)}</Row>
            <Row label="Stay">{show(row.stay)}</Row>
            <Row label="Occasion">{show(row.occasion)}</Row>
            <Row label="Message">
              <span className="whitespace-pre-wrap">{show(row.message)}</span>
            </Row>
            {extras.map(([key, value]) => (
              <Row
                key={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (c) => c.toUpperCase())}
              >
                {show(value)}
              </Row>
            ))}
          </dl>
        </section>

        <div className="space-y-6">
          <section
            aria-label="Manage enquiry"
            className="rounded-[10px] border border-line bg-card p-5"
          >
            <SaveForm id={row.id} status={row.status} notes={row.admin_notes} />
          </section>
          <DeleteButton id={row.id} />
        </div>
      </div>
    </div>
  );
}
