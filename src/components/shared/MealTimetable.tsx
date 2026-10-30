import type { MealTime } from "@/types";

interface MealTimetableProps {
  meals: MealTime[];
  hours: string;
}

/** Restaurant timetable: open hours on top, then each meal and its window. */
export function MealTimetable({ meals, hours }: MealTimetableProps) {
  return (
    <div>
      <p className="label-mono text-body/70">Open daily</p>
      <p className="mt-1 font-display text-3xl">{hours}</p>
      <dl className="mt-5 space-y-2.5">
        {meals.map((meal) => (
          <div key={meal.name} className="flex items-baseline justify-between gap-5">
            <dt>{meal.name}</dt>
            <dd className="shrink-0 text-small text-body/80 tabular-nums">{meal.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
