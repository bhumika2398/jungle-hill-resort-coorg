import { Ban, BellRing, Info, Timer, Wine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeUp } from "@/components/animations/FadeUp";

/** Picks an icon from the wording, so edited or new guidelines still get a sensible one. */
function guidelineIcon(text: string): LucideIcon {
  if (/last order/i.test(text)) return BellRing;
  if (/advance|minutes|in time/i.test(text)) return Timer;
  if (/outside food|not permitted/i.test(text)) return Ban;
  if (/alcohol|drink/i.test(text)) return Wine;
  return Info;
}

/** Ordering guidelines as a grid of short cards. */
export function OrderingGuidelines({ guidelines }: { guidelines: string[] }) {
  return (
    <div>
      <p className="label-mono text-body">Before you order</p>
      <h2 className="mt-3 text-h4">Good to know</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {guidelines.map((guideline, index) => {
          const Icon = guidelineIcon(guideline);
          return (
            <li key={guideline}>
              <FadeUp index={index} rise={8} className="h-full">
                <div className="shadow-soft flex h-full gap-4 rounded-[6px] border border-line bg-card p-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-burgundy text-ivory"
                  >
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <p className="text-body">{guideline}</p>
                </div>
              </FadeUp>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
