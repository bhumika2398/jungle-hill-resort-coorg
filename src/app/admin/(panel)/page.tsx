import Link from "next/link";
import { Delta, DailyBars, HBars, StackedBar } from "@/components/admin/charts";
import { formatBytes } from "@/lib/admin/content-types";
import { getDashboard } from "@/lib/admin/dashboard";
import { STATUSES, STATUS_LABEL, formatDate } from "@/lib/admin/enquiries";

const STATUS_COLOR = {
  new: "var(--color-burgundy)",
  contacted: "color-mix(in srgb, var(--color-burgundy) 45%, var(--color-ivory))",
  confirmed: "var(--color-olive)",
  closed: "color-mix(in srgb, var(--color-olive) 35%, var(--color-ivory))",
  spam: "color-mix(in srgb, var(--color-burgundy) 12%, var(--color-ivory))",
} as const;

function Card({
  title,
  hint,
  children,
  className = "",
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[10px] border border-line bg-card p-5 ${className}`}>
      <h2 className="font-display text-h4 leading-tight">{title}</h2>
      {hint ? <p className="mt-0.5 text-small opacity-75">{hint}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Kpi({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <span className="block text-small opacity-80">{label}</span>
      <span className="mt-1 block font-display text-h3 leading-none">{value}</span>
      {sub ? <span className="mt-2 block text-small">{sub}</span> : null}
    </>
  );
  const cls = "block h-full rounded-[10px] border border-line bg-card p-5";
  return href ? (
    <Link href={href} className={`${cls} hover:border-burgundy`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default async function DashboardPage() {
  let d;
  try {
    d = await getDashboard();
  } catch (error) {
    return (
      <p role="alert" className="rounded-[6px] border border-line bg-card p-4 text-small">
        Could not load the dashboard (
        {error instanceof Error ? error.message : "unknown error"}). Check that the
        migrations in supabase/migrations have been run.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h3">Dashboard</h1>
        <p className="mt-1 text-small">
          Enquiries and content at a glance. Figures cover the last 12 months.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <li>
          <Kpi
            label="New enquiries"
            value={String(d.status.new)}
            href="/admin/enquiries?status=new"
            sub={
              d.needsAttention > 0 ? (
                <span className="font-medium">
                  {d.needsAttention} waiting over 24 hours
                </span>
              ) : (
                "All answered within a day"
              )
            }
          />
        </li>
        <li>
          <Kpi
            label="Last 7 days"
            value={String(d.last7)}
            sub={<Delta now={d.last7} before={d.prev7} />}
          />
        </li>
        <li>
          <Kpi
            label="Last 30 days"
            value={String(d.last30)}
            sub={`${d.total} in the last 12 months`}
          />
        </li>
        <li>
          <Kpi
            label="Confirmed rate"
            value={d.confirmRate == null ? "-" : `${Math.round(d.confirmRate * 100)}%`}
            sub={`${d.status.confirmed} confirmed of ${d.genuine} genuine`}
          />
        </li>
      </ul>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Enquiries per day" hint="Last 30 days" className="lg:col-span-2">
          <DailyBars
            data={d.daily}
            label={`Enquiries per day over the last 30 days: ${d.last30} in total`}
          />
        </Card>
        <Card title="Pipeline" hint="Where every enquiry stands">
          <StackedBar
            segments={STATUSES.map((s) => ({
              label: STATUS_LABEL[s],
              count: d.status[s],
              color: STATUS_COLOR[s],
            }))}
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Stays requested" hint="Excluding spam">
          <HBars rows={d.stays} />
        </Card>
        <Card title="Guests want to visit in" hint="By requested check-in, next 6 months">
          <HBars
            rows={d.months.map((m) => ({ label: m.label, count: m.count }))}
            tone="olive"
            empty="No dates requested yet."
          />
        </Card>
        <Card title="Occasions" hint="Why guests are travelling">
          <HBars rows={d.occasions} tone="olive" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title="Upcoming arrivals"
          hint="Requested check-ins, soonest first"
          className="lg:col-span-2"
        >
          {d.upcoming.length === 0 ? (
            <p className="text-small">No upcoming arrivals.</p>
          ) : (
            <ul className="divide-y divide-line">
              {d.upcoming.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/admin/enquiries/${row.id}`}
                    className="flex flex-wrap items-center gap-x-4 gap-y-0.5 py-2.5 hover:bg-olive/10"
                  >
                    <span className="min-w-40 font-medium">{row.name}</span>
                    <span className="text-small">
                      {formatDate(row.check_in)} to {formatDate(row.check_out)}
                    </span>
                    <span className="text-small opacity-75">
                      {(row.adults ?? 0) + (row.children ?? 0)} guests
                      {row.rooms ? ` · ${row.rooms} room${row.rooms > 1 ? "s" : ""}` : ""}
                    </span>
                    <span className="ml-auto text-small">{STATUS_LABEL[row.status]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Typical enquiry">
          <dl className="space-y-3 text-small">
            <div className="flex justify-between gap-3">
              <dt>Average stay</dt>
              <dd className="font-medium">
                {d.avgNights ? `${d.avgNights.toFixed(1)} nights` : "-"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Average party</dt>
              <dd className="font-medium">
                {d.avgGuests ? `${d.avgGuests.toFixed(1)} guests` : "-"}
              </dd>
            </div>
            {d.sources.map((s) => (
              <div key={s.label} className="flex justify-between gap-3">
                <dt>{s.label}</dt>
                <dd className="font-medium">{s.count}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <Card title="Site content" hint="What you manage from this panel">
        <ul className="grid gap-3 text-small sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <Link
              href="/admin/rooms"
              className="block rounded-[6px] border border-line p-3 hover:border-burgundy"
            >
              <span className="block font-medium">Prices</span>
              {d.assets.pricedRooms} of {d.assets.totalRooms} stays have a price
            </Link>
          </li>
          <li>
            <Link
              href="/admin/rooms"
              className="block rounded-[6px] border border-line p-3 hover:border-burgundy"
            >
              <span className="block font-medium">Room photos</span>
              {d.assets.customRooms} of {d.assets.totalRooms} stays customised
            </Link>
          </li>
          <li>
            <Link
              href="/admin/gallery"
              className="block rounded-[6px] border border-line p-3 hover:border-burgundy"
            >
              <span className="block font-medium">Gallery</span>
              {d.assets.customGallery ? "Customised" : "Original photos"}
            </Link>
          </li>
          <li>
            <Link
              href="/admin/media"
              className="block rounded-[6px] border border-line p-3 hover:border-burgundy"
            >
              <span className="block font-medium">Media library</span>
              {d.assets.count} files · {formatBytes(d.assets.bytes)}
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
