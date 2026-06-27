"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun03Icon, Moon02Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#1b1b1f] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-all hover:border-black/20 hover:shadow-[0_2px_6px_-2px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun03Icon className="h-4 w-4" />
        ) : (
          <Moon02Icon className="h-4 w-4" />
        )
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
