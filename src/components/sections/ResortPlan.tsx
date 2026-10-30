"use client";

import { useState } from "react";
import Link from "next/link";
import { m } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Photo } from "@/components/shared/Photo";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PLAN_VIEWBOX, planMarkers, planPaths } from "@/data/resortPlan";
import { cn } from "@/lib/utils";

/** Plantation areas: soft olive shapes with dotted vine rows. Purely illustrative. */
const plantation = [
  "M20 400 C 60 370 130 390 150 450 C 165 510 110 570 50 555 C 10 540 0 450 20 400 Z",
  "M450 450 C 500 430 580 450 590 520 L 590 610 L 430 610 C 420 540 420 480 450 450 Z",
  "M30 70 C 80 40 150 60 160 120 C 165 170 100 210 50 190 C 10 170 5 100 30 70 Z",
  "M470 100 C 520 80 585 100 590 150 C 592 205 535 235 485 215 C 455 195 450 130 470 100 Z",
];

/** Keeps the tooltip inside the plan: flips to the left of the marker on the right-hand side. */
function tooltipStyle(x: number, y: number): React.CSSProperties {
  const top = Math.min(66, Math.max(2, (y / PLAN_VIEWBOX.height) * 100 - 20));
  return x > PLAN_VIEWBOX.width * 0.55
    ? {
        right: `${Math.max(2, 100 - (x / PLAN_VIEWBOX.width) * 100 + 3)}%`,
        top: `${top}%`,
      }
    : { left: `${Math.min(55, (x / PLAN_VIEWBOX.width) * 100 + 3)}%`, top: `${top}%` };
}

/**
 * Original illustrative site plan, drawn from the client's sketch: one winding path with
 * branches. Markers and the legend are linked: hover, focus or tap either one to highlight the
 * other and see a photo. Marker data lives in src/data/resortPlan.ts.
 */
export function ResortPlan({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const current = planMarkers.find((marker) => marker.id === active) ?? null;

  return (
    <div className={cn("grid gap-5 lg:grid-cols-12 lg:gap-6", className)}>
      <div className={compact ? "lg:col-span-5" : "lg:col-span-6"}>
        <div className="theme-sand shadow-soft relative overflow-hidden rounded-[6px] border border-line bg-surface">
          <svg
            viewBox={`0 0 ${PLAN_VIEWBOX.width} ${PLAN_VIEWBOX.height}`}
            role="group"
            aria-label="Illustrative plan of the resort, not to scale"
            className={cn(
              "block h-auto w-full",
              compact ? "lg:h-[420px]" : "lg:h-[520px]",
            )}
          >
            <defs>
              <pattern id="vines" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.4" fill="#687451" fillOpacity="0.45" />
              </pattern>
            </defs>
            <rect
              width={PLAN_VIEWBOX.width}
              height={PLAN_VIEWBOX.height}
              fill="#edE3d3"
            />
            {plantation.map((d) => (
              <g key={d}>
                <path d={d} fill="#687451" fillOpacity="0.14" />
                <path d={d} fill="url(#vines)" />
              </g>
            ))}

            {/* The path from the sketch: the main path first, then the branches */}
            {planPaths.map((p, i) => (
              <m.path
                key={i}
                d={p.d}
                fill="none"
                stroke="#a3947e"
                strokeWidth={p.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.65, delay: p.delay, ease: "easeInOut" }}
              />
            ))}

            {planMarkers
              .filter((marker) => marker.kind === "building")
              .map((marker) => (
                <rect
                  key={`b-${marker.id}`}
                  x={marker.x - 26}
                  y={marker.y - 17}
                  width="52"
                  height="34"
                  rx="3"
                  fill="#f8f1e7"
                  fillOpacity="0.9"
                  stroke="#a3947e"
                  strokeOpacity="0.8"
                />
              ))}
            {planMarkers
              .filter((marker) => marker.kind === "pool")
              .map((marker) => (
                <rect
                  key={`p-${marker.id}`}
                  x={marker.x - 36}
                  y={marker.y - 20}
                  width="72"
                  height="40"
                  rx="4"
                  fill="#687451"
                  fillOpacity="0.3"
                  stroke="#687451"
                  strokeOpacity="0.8"
                />
              ))}

            {planMarkers.map((marker) => {
              const on = marker.id === active;
              return (
                <g
                  key={marker.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${marker.id}. ${marker.label}`}
                  aria-pressed={on}
                  onMouseEnter={() => setActive(marker.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(marker.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(on ? null : marker.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActive(on ? null : marker.id);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <m.g
                    initial={reduced ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + marker.id * 0.07,
                      ease: "easeOut",
                    }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {/* Invisible, larger hit area so markers are easy to tap on phones */}
                    <circle cx={marker.x} cy={marker.y} r={44} fill="transparent" />
                    {on ? (
                      <circle
                        className="plan-pulse"
                        cx={marker.x}
                        cy={marker.y}
                        r={14}
                        fill="none"
                        stroke={marker.kind === "pool" ? "#687451" : "#641c2b"}
                        strokeWidth="1.5"
                      />
                    ) : (
                      <circle cx={marker.x} cy={marker.y} r={0} fill="none" />
                    )}
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r={on ? 17 : 14}
                      fill={on ? "#687451" : "#641c2b"}
                      stroke={marker.kind === "pool" ? "#687451" : "#641c2b"}
                      strokeWidth="1.5"
                      style={{ transition: "r 0.2s, fill 0.2s" }}
                    />
                    <text
                      x={marker.x}
                      y={marker.y + 4.5}
                      textAnchor="middle"
                      fontSize="13"
                      fontFamily="var(--font-jost), sans-serif"
                      fill="#f7f4ec"
                      style={{ pointerEvents: "none" }}
                    >
                      {marker.id}
                    </text>
                  </m.g>
                </g>
              );
            })}

            <text
              x="590"
              y="608"
              textAnchor="end"
              fontSize="10"
              letterSpacing="2"
              fill="#352c25"
              fillOpacity="0.9"
              fontFamily="var(--font-jost), sans-serif"
            >
              ILLUSTRATIVE PLAN, NOT TO SCALE
            </text>
          </svg>

          {current && (
            <GlassPanel
              role="status"
              className="pointer-events-none absolute z-10 flex w-52 gap-3 bg-card/90 p-2 text-body"
              style={tooltipStyle(current.x, current.y)}
            >
              {current.image && (
                <span className="relative block h-14 w-16 shrink-0 overflow-hidden">
                  <Photo image={current.image} fill sizes="64px" />
                </span>
              )}
              <span>
                <span className="block font-display text-lg leading-tight">
                  {current.label}
                </span>
                <span className="label-mono block text-[0.6rem]">{current.note}</span>
              </span>
            </GlassPanel>
          )}
        </div>
      </div>

      <ol
        className={compact ? "lg:col-span-7" : "lg:col-span-6"}
        aria-label="Plan legend"
      >
        {planMarkers.map((marker) => {
          const handlers = {
            onMouseEnter: () => setActive(marker.id),
            onMouseLeave: () => setActive(null),
            onFocus: () => setActive(marker.id),
            onBlur: () => setActive(null),
          };
          const row = (
            <>
              <span className="label-mono text-body">
                {String(marker.id).padStart(2, "0")}
              </span>
              <span className="text-body">{marker.label}</span>
            </>
          );
          const rowClass = cn(
            "grid min-h-11 w-full grid-cols-[2rem_1fr] items-center gap-2 py-2 text-left transition-colors",
            active === marker.id ? "bg-card" : "hover:bg-card/60",
          );
          return (
            <li key={marker.id}>
              {marker.href ? (
                <Link href={marker.href} {...handlers} className={rowClass}>
                  {row}
                </Link>
              ) : (
                <button
                  type="button"
                  {...handlers}
                  onClick={() => setActive(active === marker.id ? null : marker.id)}
                  aria-pressed={active === marker.id}
                  className={rowClass}
                >
                  {row}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
