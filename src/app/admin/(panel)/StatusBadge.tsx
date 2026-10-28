import { STATUS_LABEL, type EnquiryStatus } from "@/lib/admin/enquiries";

const tone: Record<EnquiryStatus, string> = {
  new: "bg-burgundy text-ivory border-burgundy",
  contacted: "bg-olive/20 border-olive",
  confirmed: "bg-olive text-ivory border-olive",
  closed: "border-line",
  spam: "border-line line-through opacity-70",
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-small ${tone[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
