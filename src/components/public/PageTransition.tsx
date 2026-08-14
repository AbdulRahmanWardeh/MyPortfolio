"use client";

import * as React from "react";
import { usePathname } from "@/i18n/routing";

/**
 * Wraps the page content and remounts it on route change, so the per-block
 * <Reveal>/<Stagger> animations replay for the incoming page.
 *
 * Deliberately has NO page-level transition. It previously wrapped the content
 * in <AnimatePresence mode="wait">, which holds the incoming page back until
 * the outgoing one finishes its 300ms exit. That made content arrive in two
 * stages — a blank gap, then the page frame, then a 0.8s wave of <Reveal>
 * blocks fading in — which reads as the page rendering twice. The per-block
 * reveals already are the transition; layering another one on top is what
 * produced the duplicate.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main key={pathname} className="relative z-[1] pt-24 md:pt-28">
      {children}
    </main>
  );
}
