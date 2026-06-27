"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type IconComp = React.FC<{ className?: string }>;

/** Quick-pick icons (real Hugeicons React export names). */
const COMMON_ICONS = [
  "ArrowUpRight02Icon",
  "ArrowRight02Icon",
  "ArrowRight01Icon",
  "ArrowDown02Icon",
  "Mail01Icon",
  "Calendar03Icon",
  "Clock01Icon",
  "SparklesIcon",
  "Tick02Icon",
  "PlusSignIcon",
  "StarIcon",
  "FavouriteIcon",
  "Search01Icon",
  "Globe02Icon",
  "PaintBoardIcon",
  "PencilEdit02Icon",
];

/**
 * Live preview of any Hugeicons icon, loaded on demand from the per-icon
 * subpath (`hugeicons-react/icons/<Name>`). Only previewed icons are fetched,
 * so the admin bundle never pulls the full ~40MB set. Unknown / invalid names
 * render nothing.
 */
function PreviewIcon({ name, className }: { name?: string; className?: string }) {
  const [Icon, setIcon] = React.useState<IconComp | null>(null);

  React.useEffect(() => {
    const key = (name ?? "").trim();
    // Hugeicons export names are PascalCase alphanumerics — guard the specifier.
    if (!key || !/^[A-Za-z0-9]+$/.test(key)) {
      setIcon(null);
      return;
    }
    let active = true;
    import(`hugeicons-react/icons/${key}`)
      .then((m: Record<string, IconComp | undefined>) => {
        if (active) setIcon(() => m[key] ?? m.default ?? null);
      })
      .catch(() => {
        if (active) setIcon(null);
      });
    return () => {
      active = false;
    };
  }, [name]);

  return Icon ? <Icon className={className} /> : null;
}

export function CtaIconField({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = React.useState(defaultValue ?? "");

  return (
    <div className="flex flex-col gap-3">
      <Label>CTA Icon (Hugeicons name)</Label>
      <div className="flex items-center gap-3">
        <Input
          name="ctaIcon"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="ArrowUpRight02Icon"
          className="font-mono text-xs"
        />
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.10] bg-white/[0.04]">
          <PreviewIcon name={value} className="h-5 w-5" />
        </div>
      </div>
      <p className="text-xs text-white/45">
        Leave empty to hide icons on every CTA. Set any Hugeicons React export name (e.g.
        <code className="mx-1 rounded bg-white/[0.06] px-1">ArrowUpRight02Icon</code>)
        and it will appear on Hero, About, Contact CTA, navbar Book a Meeting, View all, etc.
        Browse names at{" "}
        <a
          href="https://hugeicons.com/icons"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/80 underline-offset-2 hover:underline"
        >
          hugeicons.com
        </a>{" "}
        — use the React export name like{" "}
        <code className="rounded bg-white/[0.06] px-1">ArrowUpRight02Icon</code>.
      </p>

      <div className="mt-1 flex flex-wrap gap-1.5">
        {COMMON_ICONS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setValue(name)}
            title={name}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg border transition",
              value === name
                ? "border-accent bg-accent/15 text-accent"
                : "border-white/[0.08] bg-white/[0.02] text-white/65 hover:bg-white/[0.06] hover:text-white",
            )}
          >
            <PreviewIcon name={name} className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
