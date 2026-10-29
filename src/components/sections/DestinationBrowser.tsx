"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";
import { Photo } from "@/components/shared/Photo";
import {
  bandOf,
  distanceFilters,
  mapsSearchUrl,
  type Destination,
  type DistanceFilter,
} from "@/data/destinations";
import { cn } from "@/lib/utils";

const arrow =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-burgundy text-burgundy transition-colors hover:bg-burgundy hover:text-ivory disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-burgundy";

/**
 * Destination card: photo with the distance badge, the name and a one-line subtitle, then a footer
 * row with a short fact and an Explore button that opens the full description in place. Places
 * without a photo become a typographic card.
 */
function DestinationCard({ destination }: { destination: Destination }) {
  const { image, facts } = destination;
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const subtitle = facts.slice(0, Math.min(2, Math.max(1, facts.length - 1))).join(" · ");
  const footerFact = facts.length > 1 ? facts[facts.length - 1] : "";

  return (
    <article className="group shadow-soft flex h-full flex-col overflow-hidden rounded-[6px] border border-line bg-card text-body">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {image && (
          <Photo
            image={image}
            fill
            sizes="(min-width: 1280px) 380px, (min-width: 640px) 45vw, 82vw"
            objectPosition={image.objectPosition}
            imgClassName="transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        )}

        <span
          className={cn(
            "label-mono absolute top-3 left-3 z-10 rounded-[4px] border px-2.5 py-1 text-[0.62rem]",
            image
              ? "border-ivory/70 bg-burgundy/50 text-ivory backdrop-blur-sm"
              : "border-burgundy/40 text-burgundy",
          )}
        >
          {destination.distanceKm} km
        </span>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-30 p-3",
            image && !open
              ? "bg-gradient-to-t from-burgundy/90 via-burgundy/55 to-transparent pt-16 text-ivory"
              : !image && "top-0 flex flex-col justify-end text-burgundy",
          )}
        >
          <div className={cn(open && "hidden")}>
            <h3 className="px-1 font-display text-2xl leading-tight sm:text-[1.7rem]">
              {destination.name}
            </h3>
            {subtitle && (
              <p
                className={cn(
                  "mt-1 px-1 text-small",
                  image ? "text-ivory" : "text-body/80",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-between gap-3 rounded-[6px] px-3 py-2 text-body",
              !open && "mt-3",
              image ? "glass" : "border border-line bg-card",
            )}
          >
            <p className="min-w-0 truncate text-small">{footerFact}</p>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((value) => !value)}
              className="btn btn-primary !min-h-9 shrink-0 !px-4"
            >
              {open ? "Close" : "Explore"}
              <span className="sr-only"> {destination.name}</span>
            </button>
          </div>
        </div>

        <div
          id={detailsId}
          data-lenis-prevent
          hidden={!open}
          className="absolute inset-x-0 top-0 bottom-[4.25rem] z-20 flex flex-col overflow-y-auto bg-card/95 p-5 text-body"
        >
          <p className="label-mono text-body/70">{destination.distanceKm} km</p>
          <h3 className="mt-1 font-display text-2xl leading-tight">{destination.name}</h3>
          <p className="mt-3 text-small">{destination.description}</p>
          <ul
            className="mt-3 space-y-1.5 text-small text-body/80"
            aria-label={`Facts about ${destination.name}`}
          >
            {destination.facts.map((fact) => (
              <li key={fact} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] h-1 w-1 shrink-0 bg-olive"
                />
                {fact}
              </li>
            ))}
          </ul>
          <a
            href={mapsSearchUrl(destination.name)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${destination.name} in Maps`}
            className="link-underline touch-target mt-auto inline-flex items-center gap-1 self-start pt-3 font-medium text-burgundy"
          >
            Open in Maps <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

/** Horizontal slider: 3 cards on desktop, 2 on tablet, 1 and a peek on mobile. */
function DestinationSlider({ items }: { items: Destination[] }) {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const dragged = useRef(false);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, items.length]);

  const toPage = (next: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.min(Math.max(next, 0), pages - 1);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowRight") toPage(page + 1);
    else if (event.key === "ArrowLeft") toPage(page - 1);
  }

  function onPointerDown(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: event.clientX, left: track.current.scrollLeft };
    dragged.current = false;
  }

  function onPointerMove(event: PointerEvent<HTMLUListElement>) {
    if (!drag.current || !track.current) return;
    const dx = event.clientX - drag.current.x;
    if (Math.abs(dx) > 6) {
      dragged.current = true;
      setDragging(true);
    }
    if (dragged.current) track.current.scrollLeft = drag.current.left - dx;
  }

  function endDrag() {
    if (!drag.current) return;
    drag.current = null;
    if (dragged.current && track.current) {
      // Settle on the nearest page once the pointer is released.
      const el = track.current;
      setDragging(false);
      requestAnimationFrame(() =>
        el.scrollTo({
          left: Math.round(el.scrollLeft / el.clientWidth) * el.clientWidth,
          behavior: "smooth",
        }),
      );
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-h3">Popular near the resort</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous places"
            className={arrow}
          >
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => toPage(page + 1)}
            disabled={page >= pages - 1}
            aria-label="Next places"
            className={arrow}
          >
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Popular places near the resort"
        tabIndex={0}
        onScroll={measure}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(event) => {
          if (dragged.current) {
            event.preventDefault();
            event.stopPropagation();
            dragged.current = false;
          }
        }}
        className={cn(
          "relative mt-4 flex [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden",
          dragging
            ? "cursor-grabbing"
            : "cursor-grab snap-x snap-mandatory scroll-smooth",
        )}
      >
        {items.map((place) => (
          <li
            key={place.id}
            className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] xl:w-[calc((100%-2rem)/3)]"
          >
            <DestinationCard destination={place} />
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div
          className="mt-3 flex justify-center gap-2"
          role="group"
          aria-label="Slider pages"
        >
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toPage(i)}
              aria-label={`Page ${i + 1} of ${pages}`}
              aria-current={i === page}
              className="grid h-6 w-6 place-items-center"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  i === page ? "w-6 bg-burgundy" : "w-2 bg-burgundy/30",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Nearest places in a slider, then a distance filter and every place in a calm grid. */
export function DestinationBrowser({ destinations }: { destinations: Destination[] }) {
  const [active, setActive] = useState<DistanceFilter["id"]>("all");
  const sorted = [...destinations].sort((a, b) => a.distanceKm - b.distanceKm);
  const visible = sorted.filter(
    (place) => active === "all" || bandOf(place.distanceKm) === active,
  );

  return (
    <div>
      <DestinationSlider items={sorted.slice(0, 6)} />

      <section aria-label="All places" className="mt-[var(--space-section)]">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <h2 className="text-h3">All places</h2>
          <p className="label-mono text-body" aria-live="polite">
            {visible.length} places
          </p>
        </div>
        <div
          role="group"
          aria-label="Filter by distance"
          className="mt-2 flex flex-wrap gap-x-6 gap-y-1"
        >
          {distanceFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active === filter.id}
              onClick={() => setActive(filter.id)}
              className={cn(
                "label-mono min-h-11 transition-colors",
                active === filter.id ? "text-burgundy" : "text-body/60 hover:text-body",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((place, index) => (
            <li key={place.id} id={place.id} className="min-w-0 scroll-mt-28">
              <FadeUp index={index % 3} className="h-full">
                <DestinationCard destination={place} />
              </FadeUp>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
