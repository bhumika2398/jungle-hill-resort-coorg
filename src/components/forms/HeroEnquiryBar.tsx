"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { rooms } from "@/data/rooms";

const fieldClass =
  "mt-1 block w-full min-h-11 text-base border-0 border-b border-ivory/60 bg-transparent px-0 py-1 text-ivory [color-scheme:dark] focus:border-line focus:outline-none";

/** Glass booking bar docked in the hero. Sends the values to /contact, prefilled. */
export function HeroEnquiryBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [stay, setStay] = useState("any");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests);
    if (stay !== "any") params.set("stay", stay);
    router.push(`/contact?${params.toString()}`);
  }

  return (
    <GlassPanel>
      <form
        onSubmit={handleSubmit}
        aria-label="Check availability"
        className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_1fr_0.55fr_1.2fr_auto] lg:items-end"
      >
        <label className="label-mono block">
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="label-mono block">
          Check-out
          <input
            type="date"
            value={checkOut}
            min={checkIn || undefined}
            onChange={(event) => setCheckOut(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="label-mono block">
          Guests
          <select
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            className={`${fieldClass} [&>option]:text-body`}
          >
            {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
        <label className="label-mono block">
          Stay type
          <select
            value={stay}
            onChange={(event) => setStay(event.target.value)}
            className={`${fieldClass} [&>option]:text-body`}
          >
            <option value="any">No preference</option>
            {rooms.map((room) => (
              <option key={room.slug} value={room.slug}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="btn btn-primary gap-2 sm:col-span-2 lg:col-span-1"
        >
          Check Availability
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </form>
    </GlassPanel>
  );
}
