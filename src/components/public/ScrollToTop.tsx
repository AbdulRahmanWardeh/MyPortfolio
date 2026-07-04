"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp02Icon } from "hugeicons-react";

/**
 * Floating "back to top" button — springs in bottom-end after the user scrolls
 * past ~400px, springs back out when they're near the top again.
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
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.5, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.7 }}
          whileHover={{
            scale: 1.1,
            transition: { type: "spring", stiffness: 400, damping: 14 },
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 end-6 z-30 grid h-14 w-14 place-items-center rounded-full border-2 border-tint/30 bg-background text-accent shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7),0_0_0_4px_hsl(var(--accent)/0.12)] backdrop-blur-md transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowUp02Icon className="h-6 w-6" strokeWidth={2.5} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
