"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { Photo } from "@/components/shared/Photo";
import { BoxCard } from "@/components/ui/BoxCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { activeOffers } from "@/data/offers";
import { includedWithEveryStay } from "@/data/included";
import { roomLabel, rooms } from "@/data/rooms";
import { siteConfig } from "@/config/site.config";
import { whatsappLink } from "@/lib/contact";
import {
  enquirySchemaV2,
  OCCASIONS,
  STEP_FIELDS,
  type EnquiryValuesV2,
} from "@/lib/enquiry-schema";
import { cn } from "@/lib/utils";

const STEPS = ["Dates", "Stay", "You"] as const;
const noop = () => () => {};

/** Today as yyyy-mm-dd in the visitor's timezone. Empty on the server so markup always matches. */
function useToday() {
  return useSyncExternalStore(
    noop,
    () => {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      return new Date(now.getTime() - offset).toISOString().slice(0, 10);
    },
    () => "",
  );
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
  return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : 0;
}

function formatDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function stayName(slug: string) {
  const room = rooms.find((item) => item.slug === slug);
  if (!room) return "No preference, please suggest";
  return room.name === room.category ? room.name : `${room.name} (${room.categoryShort})`;
}

function offerName(id?: string) {
  return activeOffers.find((offer) => offer.id === id)?.title ?? "";
}

const PAYMENT_LABEL = "Pay at the resort";

function buildSummary(values: EnquiryValuesV2) {
  const nights = nightsBetween(values.checkIn, values.checkOut);
  const kids = values.children
    ? `${values.children} children (ages ${values.childAges.slice(0, values.children).join(", ")})`
    : "0 children";
  const lines = [
    "Hello Jungle Hill Resort, I would like to enquire about a stay.",
    `Dates: ${formatDate(values.checkIn)} to ${formatDate(values.checkOut)}${nights ? ` (${nights} nights)` : ""}`,
    `Guests: ${values.adults} adults, ${kids}, ${values.infants} infants`,
    `Rooms: ${values.rooms}`,
    `Stay: ${stayName(values.stay)}`,
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
  ];
  const offer = offerName(values.offerId);
  if (offer) lines.push(`Offer: ${offer}`);
  if (values.couponCode)
    lines.push(
      `Offer or coupon code: ${values.couponCode} (to be checked by the resort)`,
    );
  lines.push(`Payment: ${PAYMENT_LABEL}`);
  if (values.arrivalTime) lines.push(`Arrival: ${values.arrivalTime}`);
  if (values.occasion) lines.push(`Occasion: ${values.occasion}`);
  if (values.requests) lines.push(`Requests: ${values.requests}`);
  return lines.join("\n");
}

/** Friendly, live guest-rule notes. They warn, but never block the enquiry. */
function guestNotes(
  values: Pick<EnquiryValuesV2, "stay" | "adults" | "children" | "infants" | "rooms">,
) {
  const notes: string[] = [];
  const guests = (values.adults || 0) + (values.children || 0);
  const room = rooms.find((item) => item.slug === values.stay);
  if (!room) {
    notes.push(
      guests <= 2
        ? "For two guests we would suggest The Cloudline Suite or the Standard Non-AC Room."
        : guests <= 4
          ? "For three or four guests we would suggest The Estate House."
          : "For a bigger group we can suggest a combination of stays: tell us in the next step.",
    );
    return notes;
  }
  if (room.slug === "standard-non-ac-room" || room.slug === "standard-non-ac-cottage") {
    if (guests > 2)
      notes.push(
        `${room.name} takes two adults and an infant only. We can suggest another stay.`,
      );
  }
  if (room.slug === "deluxe-ac-rooms" && guests > 3) {
    notes.push(
      "The Cloudline Suite suits couples or small families; one extra mattress can be arranged for one additional guest.",
    );
  }
  if (room.slug === "deluxe-ac-rooms" && guests === 3) {
    notes.push(
      "A third guest uses the extra mattress, which can be arranged for one additional guest.",
    );
  }
  if (room.slug === "family-ac-room" && guests > 4) {
    notes.push(
      "The Estate House sleeps up to 4 guests; one extra mattress is available on request for one additional guest.",
    );
  }
  if (room.slug === "family-ac-room" && guests === 4) {
    notes.push(
      "Family rooms are available on the ground floor and the first floor: tell us your preference.",
    );
  }
  if ((values.rooms || 1) > 1)
    notes.push("For more than one room, tell us how you would like the guests split.");
  return notes;
}

export function EnquiryWizard({ defaultStay }: { defaultStay?: string }) {
  const params = useSearchParams();
  const today = useToday();
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState<null | { summary: string }>(null);
  const [failed, setFailed] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const guestsParam = Number(params.get("guests"));
  const requested = params.get("room") ?? params.get("stay") ?? defaultStay ?? "";
  const initialStay = rooms.some((room) => room.slug === requested) ? requested : "any";

  const {
    register,
    handleSubmit,
    trigger,
    control,
    setError,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValuesV2>({
    resolver: zodResolver(enquirySchemaV2),
    defaultValues: {
      checkIn: params.get("checkIn") ?? "",
      checkOut: params.get("checkOut") ?? "",
      adults: guestsParam > 0 ? guestsParam : 2,
      children: 0,
      childAges: [],
      infants: 0,
      rooms: 1,
      stay: initialStay,
      offerId: "",
      couponCode: "",
      paymentPreference: "pay_at_resort",
      name: "",
      phone: "",
      email: "",
      arrivalTime: "",
      occasion: undefined,
      requests: "",
      houseRules: false,
      consent: false,
    },
  });

  const watched = useWatch({ control });
  const checkIn = watched.checkIn ?? "";
  const checkOut = watched.checkOut ?? "";
  const children = Number(watched.children) || 0;
  const stay = watched.stay ?? "any";
  const nights = nightsBetween(checkIn, checkOut);
  const notes = guestNotes({
    stay,
    adults: Number(watched.adults),
    children,
    infants: Number(watched.infants),
    rooms: Number(watched.rooms),
  });

  function goTo(next: number) {
    setStep(next);
    window.setTimeout(() => heading.current?.focus(), 30);
  }

  async function next() {
    let valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    // Cross-field rules live in schema refinements, which only run once every other field is valid,
    // so they are checked here as well so that each step blocks on its own.
    if (step === 0) {
      const current = getValues();
      if (current.checkIn && current.checkOut && current.checkOut <= current.checkIn) {
        setError("checkOut", { message: "Check-out must be after check-in" });
        valid = false;
      }
      const ages = (current.childAges ?? []).slice(0, Number(current.children) || 0);
      const complete =
        ages.length === (Number(current.children) || 0) &&
        ages.every((age) => age !== "" && Number(age) >= 0 && Number(age) <= 17);
      if (!complete) {
        setError("childAges", { message: "Please enter each child's age (0 to 17)" });
        valid = false;
      }
    }
    if (valid) goTo(step + 1);
  }

  async function onSubmit(values: EnquiryValuesV2) {
    setFailed(false);
    const payload = { ...values, childAges: values.childAges.slice(0, values.children) };
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: honeypot.current?.value ?? "" }),
      });
      if (!response.ok) throw new Error("failed");
      setSent({ summary: buildSummary(payload) });
      reset();
    } catch {
      setFailed(true);
    }
  }

  if (sent) {
    const mail = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Stay enquiry")}&body=${encodeURIComponent(sent.summary)}`;
    return (
      <BoxCard className="p-4 sm:p-5" role="status">
        <p className="label-mono flex items-center gap-2 text-body">
          <Check
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="text-body"
          />{" "}
          Enquiry received
        </p>
        <h2 className="mt-3 text-h3">Thank you. We will be in touch.</h2>
        <p className="mt-3 max-w-[52ch] text-body/80">
          Your enquiry has been sent. We will confirm availability and rates shortly.
          Payment is at the resort. For a faster answer, send the same details on WhatsApp
          or by email.
        </p>
        <pre className="mt-5 max-w-full overflow-x-auto border border-line p-4 text-small whitespace-pre-wrap text-body/80">
          {sent.summary}
        </pre>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={whatsappLink(sent.summary)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary gap-2"
          >
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" /> Send on
            WhatsApp
          </a>
          <a href={mail} className="btn btn-outline gap-2">
            <Mail size={16} strokeWidth={1.5} aria-hidden="true" /> Email us
          </a>
        </div>
      </BoxCard>
    );
  }

  const values = getValues();
  const stayChoices = [
    ...rooms.map((room) => ({ slug: room.slug, room })),
    { slug: "any", room: null },
  ];

  return (
    <BoxCard className="p-4 sm:p-5">
      <ol
        aria-label="Progress"
        className="label-mono flex flex-wrap gap-x-6 gap-y-2 text-[0.68rem]"
      >
        {STEPS.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={cn(
              " pb-1.5",
              index === step
                ? "border-line text-body"
                : "border-transparent text-body/80",
            )}
          >
            {String(index + 1).padStart(2, "0")} {label}
          </li>
        ))}
      </ol>

      <form
        noValidate
        aria-label="Stay enquiry"
        className="mt-6"
        onSubmit={(event) => {
          if (step < 2) {
            event.preventDefault();
            void next();
            return;
          }
          void handleSubmit(onSubmit)(event);
        }}
      >
        <input
          ref={honeypot}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <h2 ref={heading} tabIndex={-1} className="text-h4 outline-none">
          {step === 0 && "When are you coming?"}
          {step === 1 && "Which stay?"}
          {step === 2 && "Who are we writing to?"}
        </h2>

        {step === 0 && (
          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Check-in"
                type="date"
                min={today || undefined}
                error={errors.checkIn?.message}
                {...register("checkIn")}
              />
              <Input
                label="Check-out"
                type="date"
                min={checkIn || today || undefined}
                error={errors.checkOut?.message}
                {...register("checkOut")}
              />
            </div>
            {nights > 0 && (
              <p className="label-mono text-body" aria-live="polite">
                {nights} {nights === 1 ? "night" : "nights"}
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-4">
              <Input
                label="Adults"
                type="number"
                min={1}
                inputMode="numeric"
                error={errors.adults?.message}
                {...register("adults", { valueAsNumber: true })}
              />
              <Input
                label="Children"
                type="number"
                min={0}
                inputMode="numeric"
                error={errors.children?.message}
                {...register("children", { valueAsNumber: true })}
              />
              <Input
                label="Infants"
                type="number"
                min={0}
                inputMode="numeric"
                error={errors.infants?.message}
                {...register("infants", { valueAsNumber: true })}
              />
              <Input
                label="Rooms"
                type="number"
                min={1}
                inputMode="numeric"
                error={errors.rooms?.message}
                {...register("rooms", { valueAsNumber: true })}
              />
            </div>
            {children > 0 && (
              <fieldset>
                <legend className="label-mono field-label">Ages of children</legend>
                <div className="mt-1 grid gap-5 sm:grid-cols-4">
                  {Array.from({ length: Math.min(children, 10) }, (_, index) => (
                    <Input
                      key={index}
                      label={`Child ${index + 1}`}
                      type="number"
                      min={0}
                      max={17}
                      inputMode="numeric"
                      {...register(`childAges.${index}` as const)}
                    />
                  ))}
                </div>
                {errors.childAges && (
                  <p role="alert" className="field-error mt-2 text-sm font-medium">
                    {(errors.childAges as { message?: string }).message ??
                      "Please enter each child's age (0 to 17)"}
                  </p>
                )}
              </fieldset>
            )}
          </div>
        )}

        {step === 1 && (
          <fieldset className="mt-6">
            <legend className="sr-only">Choose a stay</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {stayChoices.map(({ slug, room }) => (
                <label key={slug} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    value={slug}
                    className="peer sr-only"
                    {...register("stay")}
                  />
                  <span className="grid h-full grid-cols-[5.5rem_1fr] gap-3 rounded-[6px] border border-line p-2 transition-colors peer-checked:border-line peer-checked:bg-ivory/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-burgundy">
                    <span className="relative block aspect-square overflow-hidden bg-surface">
                      {room && <Photo image={room.images[0]} fill sizes="88px" />}
                    </span>
                    <span className="min-w-0 self-center">
                      <span className="block font-display text-xl leading-tight">
                        {room ? room.name : "No preference"}
                      </span>
                      <span className="label-mono block text-[0.62rem] text-body">
                        {room ? roomLabel(room) : "We suggest"}
                      </span>
                      <span className="mt-0.5 block text-small text-body/80">
                        {room
                          ? room.occupancy
                          : "Tell us who is coming; we will suggest a stay."}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-2 right-2 hidden h-5 w-5 place-items-center rounded-full bg-olive text-body peer-checked:grid"
                  >
                    <Check size={12} strokeWidth={2} />
                  </span>
                </label>
              ))}
            </div>
            {errors.stay && (
              <p role="alert" className="field-error mt-2 text-sm font-medium">
                {errors.stay.message}
              </p>
            )}
            <div aria-live="polite" className="mt-4 space-y-2">
              {notes.map((note) => (
                <p
                  key={note}
                  className="border-l-2 border-line pl-3 text-small text-body/80"
                >
                  {note}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6">
              <p className="label-mono text-[0.68rem] text-body">
                Included with every stay
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-small text-body/80">
                {includedWithEveryStay.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check
                      size={14}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="text-body"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {activeOffers.length > 0 && (
              <fieldset className="mt-8">
                <legend className="label-mono field-label">Choose an offer</legend>
                <div className="mt-2 grid gap-3">
                  {[
                    { id: "", title: "No offer", description: "", conditions: "" },
                    ...activeOffers,
                  ].map((offer) => (
                    <label
                      key={offer.id || "none"}
                      className="relative block cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={offer.id}
                        className="peer sr-only"
                        {...register("offerId")}
                      />
                      <span className="block rounded-[6px] border border-line p-3 transition-colors peer-checked:border-line peer-checked:bg-ivory/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-burgundy">
                        <span className="block font-display text-xl leading-tight">
                          {offer.title}
                        </span>
                        {offer.description && (
                          <span className="mt-1 block text-small text-body/80">
                            {offer.description}
                          </span>
                        )}
                        {offer.conditions && (
                          <span className="mt-1 block text-small text-body/80">
                            {offer.conditions}
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-8 max-w-sm">
              <Input
                label="Offer or coupon code (optional)"
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={20}
                hint="If you have one, we'll check it when we confirm."
                error={errors.couponCode?.message}
                {...register("couponCode")}
              />
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Name"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Phone (+91)"
                type="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Expected arrival time"
                type="time"
                error={errors.arrivalTime?.message}
                {...register("arrivalTime")}
              />
            </div>
            <Select
              label="Occasion"
              error={errors.occasion?.message}
              defaultValue=""
              {...register("occasion")}
            >
              <option value="" disabled>
                Choose one
              </option>
              {OCCASIONS.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </Select>
            <Textarea
              label="Special requests (optional)"
              error={errors.requests?.message}
              {...register("requests")}
            />

            <fieldset>
              <legend className="label-mono field-label">
                How would you like to pay?
              </legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <label className="relative block cursor-pointer">
                  <input
                    type="radio"
                    value="pay_at_resort"
                    className="peer sr-only"
                    {...register("paymentPreference")}
                  />
                  <span className="block rounded-[6px] border border-line p-3 transition-colors peer-checked:border-line peer-checked:bg-ivory/10 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-burgundy">
                    <span className="block font-display text-xl leading-tight">
                      Pay at the resort
                    </span>
                  </span>
                </label>
                <label className="relative block cursor-not-allowed opacity-60">
                  <input
                    type="radio"
                    value="pay_online"
                    disabled
                    className="peer sr-only"
                  />
                  <span className="flex items-center justify-between gap-3 rounded-[6px] border border-line p-3">
                    <span className="block font-display text-xl leading-tight">
                      Pay online
                    </span>
                    <span className="label-mono text-[0.6rem] text-body">
                      Coming soon
                    </span>
                  </span>
                </label>
              </div>
              <p className="mt-2 text-small text-body/80">
                No payment is taken now. Your enquiry is confirmed by the resort, and you
                pay on arrival.
              </p>
            </fieldset>

            <div className="space-y-3">
              <label className="flex items-start gap-3 text-small">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-burgundy"
                  {...register("houseRules")}
                />
                <span>
                  I have read the house rules: ID proof is mandatory, visitors are not
                  allowed after 8:30 PM, no loud music or loud sounds after 10:00 PM, no
                  outside food.
                </span>
              </label>
              {errors.houseRules && (
                <p role="alert" className="field-error text-sm font-medium">
                  {errors.houseRules.message}
                </p>
              )}
              <label className="flex items-start gap-3 text-small">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-burgundy"
                  {...register("consent")}
                />
                <span>
                  I agree that Jungle Hill Resort may contact me about this enquiry and
                  keep these details for that purpose, as described in the{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="underline decoration-burgundy underline-offset-4"
                  >
                    Privacy policy
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && (
                <p role="alert" className="field-error text-sm font-medium">
                  {errors.consent.message}
                </p>
              )}
            </div>

            <dl className="grid gap-x-8 gap-y-2 pt-5 text-small sm:grid-cols-2">
              <div>
                <dt className="label-mono text-[0.62rem] text-body">Dates</dt>
                <dd>
                  {formatDate(values.checkIn)} to {formatDate(values.checkOut)}
                  {nights > 0 ? ` · ${nights} nights` : ""}
                </dd>
              </div>
              <div>
                <dt className="label-mono text-[0.62rem] text-body">Guests</dt>
                <dd>
                  {values.adults} adults, {values.children} children, {values.infants}{" "}
                  infants · {values.rooms} {Number(values.rooms) === 1 ? "room" : "rooms"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="label-mono text-[0.62rem] text-body">Stay</dt>
                <dd>{stayName(values.stay)}</dd>
              </div>
              {(offerName(values.offerId) || values.couponCode) && (
                <div className="sm:col-span-2">
                  <dt className="label-mono text-[0.62rem] text-body">Offer</dt>
                  <dd>
                    {[
                      offerName(values.offerId),
                      values.couponCode &&
                        `Code ${values.couponCode} (checked by the resort)`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="label-mono text-[0.62rem] text-body">Payment</dt>
                <dd>{PAYMENT_LABEL}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="btn btn-outline gap-2"
            >
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /> Back
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => void next()}
              className="btn btn-primary gap-2"
            >
              Continue <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-60"
            >
              {isSubmitting ? "Sending" : "Send enquiry"}
            </button>
          )}
          <span className="label-mono ml-auto text-[0.62rem] text-body/80">
            {siteConfig.contact.phoneDisplay}
          </span>
        </div>

        {failed && (
          <p
            role="alert"
            className="mt-4 border-l-2 border-line pl-3 text-small"
          >
            That did not go through. Please try again, or call or WhatsApp us.
          </p>
        )}
      </form>
    </BoxCard>
  );
}
