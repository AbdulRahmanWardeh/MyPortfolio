import { ArrowUpRight02Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

/**
 * A small white circle wrapping a purple arrow.
 * Use inside CTAs to give the link a "button-inside-a-button" look.
 *
 * Example:
 *   <Button variant="accent"><Link>Book a meeting<ArrowCircle/></Link></Button>
 */
export function ArrowCircle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const icon = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full bg-white text-[hsl(var(--accent))] transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
        dims,
        className,
      )}
    >
      <ArrowUpRight02Icon
        className={cn("rtl:rotate-[-90deg]", icon)}
        strokeWidth={2.5}
      />
    </span>
  );
}
