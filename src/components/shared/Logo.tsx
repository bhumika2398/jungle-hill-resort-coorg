import Image from "next/image";
import { HoverLink as Link } from "@/components/shared/HoverLink";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Kept for existing call sites: the logo keeps its original colours everywhere. */
  variant?: "dark" | "light";
  /** Sit the logo on a soft ivory plate, for use over photos. */
  backed?: boolean;
  className?: string;
  /** Render without a link (e.g. in the footer next to other links). */
  asLink?: boolean;
  priority?: boolean;
}

const SOURCE = "/images/logo/logo.png";

/**
 * The real Jungle Hill logo (peak, wordmark, rule and tagline), as transparent PNGs made from the
 * supplied artwork. Size it by height; width follows the 982:642 ratio so it is never stretched.
 */
export function Logo({
  backed = false,
  className,
  asLink = true,
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src={SOURCE}
      alt={`${siteConfig.shortName}, ${siteConfig.tagline}`}
      width={971}
      height={631}
      priority={priority}
      sizes="160px"
      className={cn(
        "h-14 w-auto",
        backed && "rounded-[6px] bg-ivory/90 px-2 py-1 transition-colors",
        className,
      )}
    />
  );

  if (!asLink) return image;

  return (
    <Link href="/" aria-label={`${siteConfig.name}, home`} className="inline-block">
      {image}
    </Link>
  );
}
