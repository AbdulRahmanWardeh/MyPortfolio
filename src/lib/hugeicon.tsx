import * as React from "react";
import {
  ArrowUpRight02Icon,
  ArrowRight02Icon,
  ArrowRight01Icon,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowLeft01Icon,
  Mail01Icon,
  Calendar03Icon,
  Clock01Icon,
  SparklesIcon,
  Tick02Icon,
  PlusSignIcon,
  StarIcon,
  FavouriteIcon,
  Search01Icon,
  Globe02Icon,
  PaintBoardIcon,
  PencilEdit02Icon,
  Sun03Icon,
  Moon02Icon,
  Menu02Icon,
  Cancel01Icon,
} from "hugeicons-react";
import { cn } from "@/lib/utils";

type IconComp = React.FC<{ className?: string; strokeWidth?: number }>;

/**
 * Explicit icon registry — keeps bundle size small by avoiding the
 * `import * as HugeIcons` wildcard which forces every icon (~1 MB) into
 * the client bundle. Add new entries here as the admin needs them.
 */
const ICON_MAP: Record<string, IconComp> = {
  ArrowUpRight02Icon,
  ArrowRight02Icon,
  ArrowRight01Icon,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowLeft01Icon,
  Mail01Icon,
  Calendar03Icon,
  Clock01Icon,
  Sparkles01Icon: SparklesIcon,
  SparklesIcon,
  Tick02Icon,
  // Common aliases referenced by older tickets / quick-picks
  Plus01Icon: PlusSignIcon,
  PlusSignIcon,
  Star01Icon: StarIcon,
  StarIcon,
  Heart01Icon: FavouriteIcon,
  FavouriteIcon,
  Search01Icon,
  Globe02Icon,
  PaintBoardIcon,
  PencilEdit02Icon,
  Sun03Icon,
  Moon02Icon,
  Menu02Icon,
  Cancel01Icon,
};

/**
 * Renders a hugeicon by its named export, e.g. "ArrowUpRight02Icon".
 * If the name doesn't exist, renders nothing.
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
 * Quick-pick icons surfaced in the admin Settings page.
 * Keep aligned with ICON_MAP keys above.
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
  "PlusSignIcon",
  "StarIcon",
  "FavouriteIcon",
  "Search01Icon",
  "Globe02Icon",
  "PaintBoardIcon",
  "PencilEdit02Icon",
];
