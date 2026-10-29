"use client";

import { deleteEnquiry } from "@/lib/admin/actions";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteEnquiry.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm("Delete this enquiry permanently?")) event.preventDefault();
      }}
    >
      <button
        type="submit"
        className="min-h-11 rounded-[6px] border border-line px-4 text-small"
      >
        Delete enquiry
      </button>
    </form>
  );
}
