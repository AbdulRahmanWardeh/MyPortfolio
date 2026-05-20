"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicIcon, COMMON_ICONS } from "@/lib/hugeicon";
import { cn } from "@/lib/utils";

export function CtaIconField({ defaultValue }: { defaultValue?: string }) {
  const [value, setValue] = React.useState(defaultValue ?? "ArrowUpRight02Icon");

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
          <DynamicIcon name={value} className="h-5 w-5" />
        </div>
      </div>
      <p className="text-xs text-white/45">
        Used as the trailing icon for every CTA across the site (Hero, About, Contact CTA,
        navbar Book a Meeting, View all, etc). Browse names at{" "}
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
            <DynamicIcon name={name} className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
