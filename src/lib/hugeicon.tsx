import * as React from "react";
import * as HugeIcons from "hugeicons-react";
import { cn } from "@/lib/utils";

type IconComp = React.FC<{ className?: string; strokeWidth?: number }>;

const ICON_MAP = HugeIcons as unknown as Record<string, IconComp>;

/**
 * Renders a hugeicon by its named export, e.g. "ArrowUpRight02Icon".
 * If the name doesn't exist, renders nothing (gracefully degrades).
 *
 * Pair this with an admin text field so the icon can be swapped without code.
 */
export function DynamicIcon({
  name,
  className,
  fallback,
}: {
  name?: string | null;
  className?: string;
  /** Optional fallback icon name if `name` is missing. If both are empty, nothing renders. */
  fallback?: string;
}) {
  const trimmed = (name ?? "").trim();
  const key = trimmed || (fallback ?? "");
  if (!key) return null;
  const Icon = ICON_MAP[key];
  if (!Icon) return null;
  return <Icon className={cn("h-4 w-4", className)} />;
}

/**
 * Common hugeicons referenced from admin form helpers.
 */
export const COMMON_ICONS = [
  "ArrowUpRight02Icon",
  "ArrowRight02Icon",
  "ArrowRight01Icon",
  "ArrowDown02Icon",
  "Mail01Icon",
  "Calendar03Icon",
  "Clock01Icon",
  "Sparkles01Icon",
  "Tick02Icon",
  "Plus01Icon",
  "Star01Icon",
  "Heart01Icon",
  "Search01Icon",
  "Globe02Icon",
  "PaintBoardIcon",
  "PencilEdit02Icon",
];
