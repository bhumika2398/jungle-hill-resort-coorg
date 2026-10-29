import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { RevealText } from "@/components/animations/RevealText";
import { EnquiryWizard } from "@/components/forms/EnquiryWizard";
import { BentoGallery } from "@/components/shared/BentoGallery";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { checkTimes } from "@/data/policies";
import { getRoomBySlug, roomLabel, roomTitle, rooms } from "@/data/rooms";
import { getRoom } from "@/lib/site-content";
import type { Room } from "@/types";
import { whatsappLink } from "@/lib/contact";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd, roomJsonLd } from "@/lib/structured-data";
import { buildMetadata } from "@/lib/metadata";

interface RoomPageProps {
  params: Promise<{ slug: string }>;
}

function roomDescription(room: Room) {
  // Aim for 140 to 160 characters: add amenities while they fit.
  const head = `${roomTitle(room)} at Jungle Hill Resort, Coorg: ${room.sizeSqFt} sq ft, ${room.bed.toLowerCase()}`;
  const tail = ". Rates on enquiry.";
  let out = head + tail;
  for (const amenity of room.amenities) {
    const next = `${head}, ${[...out.slice(head.length + 2, -tail.length).split(", ").filter(Boolean), amenity.toLowerCase()].join(", ")}${tail}`;
    if (next.length > 160) break;
    out = next;
  }
  return out;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: RoomPageProps) {
  const { slug } = await params;
  const room = getRoomBySlug(slug);
  return buildMetadata({
    title: room ? roomTitle(room) : "Stay",
    description: room ? roomDescription(room) : undefined,
    path: `/rooms/${slug}`,
  });
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();

  const index = rooms.findIndex((item) => item.slug === slug);
  const previous = rooms[(index - 1 + rooms.length) % rooms.length];
  const next = rooms[(index + 1) % rooms.length];
  const enquiry = `Hello Jungle Hill Resort, I would like to enquire about ${roomTitle(room)}.`;

  const facts = [
    { label: "Size", value: `${room.sizeSqFt} sq ft` },
    { label: "Bed", value: room.bed },
    { label: "Sleeps", value: room.occupancy },
    ...(room.locations.length
      ? [{ label: "Where", value: room.locations.join(" · ") }]
      : []),
    { label: "Rates", value: room.rateNote },
  ];

  return (
    <>
      <JsonLd data={roomJsonLd(room)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Stays", path: "/rooms" },
          { name: room.name, path: `/rooms/${room.slug}` },
        ])}
      />
      <section aria-label={room.name} className="pt-28 sm:pt-32">
        <div className="page-container">
          <p className="label-mono text-body">
            <Link href="/rooms" className="link-underline">
              Stays
            </Link>{" "}
            — {room.number}
          </p>
          <RevealText
            as="h1"
            immediate
            lines={[{ text: room.name }]}
            className="mt-4 text-h1"
          />
          <p className="label-mono mt-3 text-body">
            {roomLabel(room)}
          </p>

          <div className="mt-6">
            <BentoGallery
              images={room.images}
              overlay={
                <GlassPanel className="pointer-events-auto grid max-w-md gap-x-6 gap-y-2 bg-ink/55 p-4 sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <p className="label-mono text-[0.6rem] text-ivory/90">
                        {fact.label}
                      </p>
                      <p className="font-display text-lg leading-tight">{fact.value}</p>
                    </div>
                  ))}
                </GlassPanel>
              }
            />
          </div>
        </div>
      </section>

      <section aria-label="About this stay" className="section-space">
        <div className="page-container grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label-mono text-body">About this stay</p>
            <p className="mt-3 font-display text-h3">{room.summary}</p>
            <p className="mt-4 max-w-[58ch] text-body">{room.description}</p>
            {room.guestNotes.map((note) => (
              <p
                key={note}
                className="mt-3 max-w-[58ch] border-l-2 border-line pl-4"
              >
                {note}
              </p>
            ))}

            <h2 className="label-mono mt-8 text-body">In the stay</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {room.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="rounded-[6px] border border-line px-3 py-3 text-small"
                >
                  {amenity}
                </li>
              ))}
            </ul>

            <h2 className="label-mono mt-8 text-body">House policies</h2>
            <ul className="mt-3 space-y-2 text-small text-body">
              <li>
                Check-in {checkTimes.checkIn} · Check-out {checkTimes.checkOut}.{" "}
                {checkTimes.note}
              </li>
              <li>ID proof is mandatory. Visitors are not allowed after 8:30 PM.</li>
              <li>No loud music or loud sounds after 10:00 PM. Outside food is not permitted.</li>
            </ul>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="rounded-[6px] border border-line bg-card p-5 text-body shadow-soft lg:sticky lg:top-24">
              <p className="label-mono text-body">{room.rateNote}</p>
              <p className="mt-2 font-display text-h4">{room.name}</p>
              <div className="mt-4 flex flex-col gap-3">
                <a href="#enquire" className="btn btn-primary">
                  Enquire about this stay
                </a>
                <a
                  href={whatsappLink(enquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline gap-2"
                >
                  <MessageCircle size={16} strokeWidth={1.5} aria-hidden="true" />{" "}
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="enquire"
        aria-label={`Enquire about ${room.name}`}
        className="section-space scroll-mt-20 bg-surface theme-sage"
      >
        <div className="page-container">
          <p className="label-mono text-body">Enquire</p>
          <h2 className="mt-3 mb-6 text-h2">
            Ask about {room.name}.
          </h2>
          <Suspense fallback={<p className="text-body">Loading the form…</p>}>
            <EnquiryWizard defaultStay={room.slug} />
          </Suspense>
        </div>
      </section>

      <nav
        aria-label="Other stays"
        className="page-container grid gap-6 py-[var(--space-section)] sm:grid-cols-2"
      >
        <Link
          href={`/rooms/${previous.slug}`}
          className="group pt-5"
        >
          <span className="label-mono flex items-center gap-2 text-body">
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" /> Previous
          </span>
          <span className="mt-2 block font-display text-h4 group-hover:underline">
            {previous.name}
          </span>
        </Link>
        <Link
          href={`/rooms/${next.slug}`}
          className="group pt-5 sm:text-right"
        >
          <span className="label-mono flex items-center gap-2 text-body sm:justify-end">
            Next <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="mt-2 block font-display text-h4 group-hover:underline">
            {next.name}
          </span>
        </Link>
      </nav>
    </>
  );
}
