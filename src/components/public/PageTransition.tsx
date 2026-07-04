"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/i18n/routing";

/**
 * Wraps the page content and re-runs an enter animation on every route change,
 * keyed on the pathname. Lives in the persistent SiteLayout so navigating
 * between pages fades/slides the new page in.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-[1] pt-24 md:pt-28"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
