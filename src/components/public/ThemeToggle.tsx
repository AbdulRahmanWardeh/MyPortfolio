"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Sun03Icon, Moon02Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white text-[#1b1b1f] shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-colors hover:border-black/20 hover:shadow-[0_2px_6px_-2px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Sun03Icon className="h-4 w-4" />
            ) : (
              <Moon02Icon className="h-4 w-4" />
            )}
          </motion.span>
        ) : (
          <span className="h-4 w-4" />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
