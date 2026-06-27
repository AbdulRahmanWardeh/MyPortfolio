import * as React from "react";
import { cn } from "@/lib/utils";

type IconComp = React.FC<{ className?: string; strokeWidth?: number }>;

/**
 * Renders ANY Hugeicons React icon by its export name, e.g. "ArrowUpRight02Icon".
 *
 * The icon is loaded on demand from the package's per-icon subpath
 * (`hugeicons-react/icons/<Name>`), so only the icons actually referenced end
 * up in the build — never the full ~40MB set. Unknown / empty names render
 * nothing.
 *
 * This is an async Server Component. Render it inside Server Components, or
 * render it on the server and pass the result as a prop/child into a Client
 * Component (see SiteLayout → Navbar). Do NOT import it into a Client
 * Component module — that would pull the icon loader into the client bundle.
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
  // Hugeicons export names are PascalCase alphanumerics. Guard the dynamic
  // import specifier so a stray value can never escape the icons directory.
  if (!key || !/^[A-Za-z0-9]+$/.test(key)) return null;

  try {
    const mod = (await import(`hugeicons-react/icons/${key}`)) as Record<
      string,
      IconComp | undefined
    >;
    const Icon = mod[key] ?? mod.default;
    if (!Icon) return null;
    return <Icon className={cn("h-4 w-4", className)} />;
  } catch {
    // Name doesn't resolve to a real icon module — render nothing.
    return null;
  }
}
