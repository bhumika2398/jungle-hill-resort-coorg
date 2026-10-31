"use client";

import { useState } from "react";
import { HoverLink as Link } from "@/components/shared/HoverLink";
import { m } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Photo } from "@/components/shared/Photo";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PLAN_VIEWBOX, planMarkers, planPaths } from "@/data/resortPlan";
import { cn } from "@/lib/utils";

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
            className="block h-auto w-full"
          >
            <rect
              width={PLAN_VIEWBOX.width}
              height={PLAN_VIEWBOX.height}
              fill="#edE3d3"
            />

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

            {/* Names beside the road, as written on the sketch */}
            {planMarkers
              .filter((marker) => marker.mapLabel.length > 0)
              .map((marker) => (
                <text
                  key={`t-${marker.id}`}
                  x={marker.x + marker.labelDx}
                  y={marker.y + marker.labelDy - (marker.mapLabel.length - 1) * 7}
                  textAnchor={marker.labelAnchor}
                  fontSize="16"
                  letterSpacing="0.3"
                  fill="#641c2b"
                  fontFamily="var(--font-jost), sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {marker.mapLabel.map((line, i) => (
                    <tspan key={line} x={marker.x + marker.labelDx} dy={i === 0 ? 0 : 15}>
                      {line}
                    </tspan>
                  ))}
                </text>
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
                    <circle cx={marker.x} cy={marker.y} r={26} fill="transparent" />
                    {on ? (
                      <circle
                        className="plan-pulse"
                        cx={marker.x}
                        cy={marker.y}
                        r={18}
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
                      r={on ? 21 : 18}
                      fill={on ? "#687451" : "#641c2b"}
                      stroke={marker.kind === "pool" ? "#687451" : "#641c2b"}
                      strokeWidth="1.5"
                      style={{ transition: "r 0.2s, fill 0.2s" }}
                    />
                    <text
                      x={marker.x}
                      y={marker.y + 5.5}
                      textAnchor="middle"
                      fontSize="15"
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
              x={12}
              y={22}
              textAnchor="start"
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
