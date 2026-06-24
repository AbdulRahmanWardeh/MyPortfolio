"use client";

import * as React from "react";
import { ArrowUp02Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

/**
 * Floating "back to top" button — appears bottom-end after the user scrolls
 * past ~400px, fades out smoothly when they're near the top again.
 */
export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 end-6 z-30 grid h-14 w-14 place-items-center rounded-full border-2 border-white/30 bg-background text-accent shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7),0_0_0_4px_hsl(var(--accent)/0.12)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-white",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp02Icon className="h-6 w-6" strokeWidth={2.5} />
    </button>
  );
}
