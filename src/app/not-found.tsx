import { HoverLink as Link } from "@/components/shared/HoverLink";
import { PageHero } from "@/components/shared/PageHero";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHero
        label="404"
        lines={[{ text: "This path" }, { text: "has gone ", emphasis: "quiet." }]}
        description={<p>The page you were looking for is not here. These might help.</p>}
      />
      <section aria-label="Where to next" className="pb-[var(--space-section)]">
        <div className="page-container flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/rooms" className="btn btn-outline">
            See the stays
          </Link>
          <Link href="/booking" className="btn btn-outline">
            Enquire
          </Link>
        </div>
      </section>
    </>
  );
}
