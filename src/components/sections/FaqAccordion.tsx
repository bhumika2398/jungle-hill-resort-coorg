"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Faq } from "@/types";

/** Accessible accordion: one answer open at a time, each header a real button. */
export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ul className="grid gap-2.5">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        return (
          <li key={faq.id} className="rounded-[6px] border border-line bg-card">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${faq.id}`}
                id={`faq-button-${faq.id}`}
                onClick={() => setOpen(isOpen ? null : faq.id)}
                className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left font-display text-xl leading-snug"
              >
                {faq.question}
                <Plus
                  size={18}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-burgundy transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              id={`faq-${faq.id}`}
              role="region"
              aria-labelledby={`faq-button-${faq.id}`}
              hidden={!isOpen}
              className="px-4 pb-4"
            >
              <p className="max-w-2xl text-body">{faq.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
