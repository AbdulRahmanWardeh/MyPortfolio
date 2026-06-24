"use client";

import * as React from "react";
import {
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  className?: string;
  /** Accessible label prefix for the dots, e.g. "Go to slide". */
  dotLabel?: string;
}

/**
 * Shared dots + prev/next controls for the public carousels. Extracted
 * verbatim from the duplicated markup that previously lived in both
 * ProjectsSwiper and TestimonialsCarousel so the two stay in lockstep.
 */
export function CarouselControls({
  count,
  index,
  onSelect,
  className,
  dotLabel = "Go to",
}: CarouselControlsProps) {
  if (count <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between gap-4 px-1", className)}>
      <div className="flex items-center gap-1.5" role="tablist">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`${dotLabel} ${i + 1}`}
            onClick={() => onSelect(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              index === i
                ? "w-6 bg-white"
                : "w-1.5 bg-white/30 hover:bg-white/50",
            )}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <CarouselArrow
          direction="prev"
          disabled={index === 0}
          onClick={() => onSelect(index - 1)}
        />
        <CarouselArrow
          direction="next"
          disabled={index === count - 1}
          onClick={() => onSelect(index + 1)}
        />
      </div>
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous" : "Next"}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition-all hover:border-white/30 hover:bg-white hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:border-white/[0.10] disabled:hover:bg-white/[0.03] disabled:hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
