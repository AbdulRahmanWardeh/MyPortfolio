"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun03Icon, Moon02Icon } from "hugeicons-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/75 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
      suppressHydrationWarning
    >
      {isDark ? (
        <Sun03Icon className="h-4 w-4" />
      ) : (
        <Moon02Icon className="h-4 w-4" />
      )}
    </button>
  );
}
