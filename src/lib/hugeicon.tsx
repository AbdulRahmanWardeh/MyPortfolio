import * as React from "react";
import * as HugeIcons from "hugeicons-react";
import { cn } from "@/lib/utils";

type IconComp = React.FC<{ className?: string; strokeWidth?: number }>;

const ICON_MAP = HugeIcons as unknown as Record<string, IconComp | undefined>;

/**
 * Renders ANY Hugeicons React icon by its export name, e.g. "ArrowUpRight02Icon".
 *
 * Icons are resolved by export name from the library namespace. Because this is
 * a Server Component, the lookup table stays on the server and never ships to
 * the client bundle. Unknown / empty names render nothing.
 *
 * Render it inside Server Components, or render it on the server and pass the
 * result as a prop/child into a Client Component (see SiteLayout → Navbar). Do
 * NOT import it into a Client Component module — that would pull the icon set
 * into the client bundle.
 */
export async function DynamicIcon({
  name,
  className,
  fallback,
}: {
  name?: string | null;
  className?: string;
  /** Optional fallback icon name used when `name` is missing. */
  fallback?: string;
}) {
  const key = ((name ?? "").trim() || (fallback ?? "").trim());
  // Hugeicons export names are PascalCase alphanumerics — guard the lookup.
  if (!key || !/^[A-Za-z0-9]+$/.test(key)) return null;

  const Icon = ICON_MAP[key];
  if (!Icon) return null;
  return <Icon className={cn("h-4 w-4", className)} />;
}
