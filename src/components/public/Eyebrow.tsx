import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The small uppercase "eyebrow" label that sits above section and page
 * headings (e.g. "About me", "Selected experience"). Single source of
 * truth so the tracking, color, and leading rule stay identical
 * everywhere instead of being re-typed per section.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-tint/40",
        className,
      )}
    >
      <span className="h-px w-8 bg-tint/20" aria-hidden />
      {children}
    </span>
  );
}
