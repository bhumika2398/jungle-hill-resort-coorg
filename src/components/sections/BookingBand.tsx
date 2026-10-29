"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const field =
  "mt-1 block w-full min-h-11 rounded-[6px] border border-ivory-line bg-ivory-card px-3 py-2 text-base text-ivory-ink focus:border-burgundy focus:outline-none";

/** Burgundy band (the second accent-filled band) with a small availability form that opens /contact prefilled. */
export function BookingBand() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", guests);
    router.push(`/contact?${params.toString()}`);
  }

  return (
    <section
      id="booking"
      aria-label="Ask about your dates"
      className="section-space relative isolate overflow-hidden bg-burgundy text-ivory"
    >
      <div className="page-container relative grid items-center gap-6 lg:grid-cols-[0.8fr_1.5fr] lg:gap-8">
        <div>
          <h2 className="text-h3 text-ivory">
            Dates in mind?
          </h2>
        </div>

        <form
          onSubmit={submit}
          aria-label="Send an enquiry"
          className="glass grid gap-4 rounded-[6px] p-4 text-body sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.6fr_auto] lg:items-end"
        >
          <label className="label-mono block">
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className={field}
            />
          </label>
          <label className="label-mono block">
            Check-out
            <input
              type="date"
              value={checkOut}
              min={checkIn || undefined}
              onChange={(e) => setCheckOut(e.target.value)}
              className={field}
            />
          </label>
          <label className="label-mono block">
            Guests
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className={field}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary gap-2">
            Send Enquiry{" "}
            <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}
