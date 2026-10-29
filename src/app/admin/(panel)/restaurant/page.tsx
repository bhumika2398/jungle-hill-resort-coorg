import type { Metadata } from "next";
import { RestaurantEditor } from "@/components/admin/RestaurantEditor";
import { dining } from "@/data/dining";
import { getContentValue } from "@/lib/admin/queries";
import {
  RESTAURANT_KEY,
  applyRestaurantContent,
  type RestaurantContent,
} from "@/lib/site-content";

export const metadata: Metadata = { title: "Restaurant" };

export default async function AdminRestaurantPage() {
  const stored = await getContentValue<RestaurantContent>(RESTAURANT_KEY);
  const current = applyRestaurantContent(dining, stored ?? undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h3">Restaurant</h1>
        <p className="mt-1 text-small">
          The text on the Restaurant page: welcome paragraph, opening hours, meal timings,
          guidelines and cuisines. Hours also appear on the About page, the FAQ and in
          search results. Cuisines also appear on the home page and the About page.
        </p>
      </div>
      <RestaurantEditor
        initial={{
          intro: current.intro,
          opens: current.opens,
          closes: current.closes,
          cuisines: current.cuisines,
          meals: current.meals.map((meal) => ({ name: meal.name, time: meal.time })),
          guidelines: current.guidelines,
        }}
        customised={!!stored}
      />
    </div>
  );
}
