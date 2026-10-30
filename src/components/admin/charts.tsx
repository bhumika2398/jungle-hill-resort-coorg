/** Small server-rendered SVG/HTML charts in the site palette (burgundy, sage, ivory). No client JS. */

interface DailyBarsProps {
  data: { day: string; count: number }[];
  /** Accessible summary of the chart. */
  label: string;
}

const dayLabel = (day: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(
    new Date(`${day}T00:00:00`),
  );

export function DailyBars({ data, label }: DailyBarsProps) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const ceil = max <= 4 ? max : Math.ceil(max / 2) * 2;
  const W = 600;
  const H = 180;
  const left = 26;
  const bottom = 22;
  const plotW = W - left;
  const plotH = H - bottom - 8;
  const step = plotW / data.length;
  const barW = step * 0.68;
  const ticks = [0, Math.round(ceil / 2), ceil].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={label}
        className="h-auto w-full"
      >
        {ticks.map((tick) => {
          const y = 8 + plotH - (tick / ceil) * plotH;
          return (
            <g key={tick}>
              <line
                x1={left}
                x2={W}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.14}
              />
              <text
                x={left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="currentColor"
                opacity={0.7}
              >
                {tick}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.count / ceil) * plotH;
          const x = left + i * step + (step - barW) / 2;
          return (
            <g key={d.day}>
              <title>{`${dayLabel(d.day)}: ${d.count}`}</title>
              <rect
                x={x}
                y={8 + plotH - h}
                width={barW}
                height={Math.max(h, d.count ? 2 : 0)}
                rx={2}
                fill="var(--color-burgundy)"
              />
              {i % 7 === 0 || i === data.length - 1 ? (
                <text
                  x={x + barW / 2}
                  y={H - 6}
                  textAnchor="middle"
                  fontSize={11}
                  fill="currentColor"
                  opacity={0.7}
                >
                  {dayLabel(d.day)}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

interface HBarsProps {
  rows: { label: string; count: number }[];
  /** Colour for the bars. */
  tone?: "burgundy" | "olive";
  empty?: string;
}

export function HBars({
  rows,
  tone = "burgundy",
  empty = "Nothing to show yet.",
}: HBarsProps) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (rows.length === 0) return <p className="text-small">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between gap-3 text-small">
            <span>{row.label}</span>
            <span className="tabular-nums">
              {row.count}
              <span className="opacity-60">
                {" "}
                · {Math.round((row.count / total) * 100)}%
              </span>
            </span>
          </div>
          <div
            className="mt-1 h-2.5 overflow-hidden rounded-full bg-olive/15"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(row.count / max) * 100}%`,
                background:
                  tone === "olive" ? "var(--color-olive)" : "var(--color-burgundy)",
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface StackedBarProps {
  segments: { label: string; count: number; color: string }[];
}

/** One horizontal bar split into labelled segments, with a legend that carries the numbers. */
export function StackedBar({ segments }: StackedBarProps) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return <p className="text-small">Nothing to show yet.</p>;
  return (
    <div>
      <div
        className="flex h-4 overflow-hidden rounded-full bg-olive/15"
        role="img"
        aria-label={segments.map((s) => `${s.label} ${s.count}`).join(", ")}
      >
        {segments
          .filter((s) => s.count > 0)
          .map((s) => (
            <div
              key={s.label}
              style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
              title={`${s.label}: ${s.count}`}
            />
          ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-small">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full border border-line"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            {s.label} <span className="tabular-nums opacity-70">{s.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) return <span className="opacity-70">No change</span>;
  if (before === 0) return <span>New this week</span>;
  const pct = Math.round(((now - before) / before) * 100);
  return (
    <span>
      {pct >= 0 ? "▲" : "▼"} {Math.abs(pct)}%{" "}
      <span className="opacity-70">vs previous 7 days</span>
    </span>
  );
}
