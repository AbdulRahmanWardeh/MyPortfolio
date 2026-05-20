"use client";

import { motion } from "framer-motion";

/**
 * Animated decorative backdrop for the hero — sits at -z-10.
 *  - Soft dotted grid with a top→bottom opacity fade (via mask).
 *  - Two drifting glow orbs (purple + neutral) for slow motion.
 *  - A subtle spotlight gradient that breathes.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 -top-28 -z-10 overflow-hidden md:-top-32"
    >
      {/* Dotted pattern with linear opacity fade */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(var(--pattern-dot) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.15) 65%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.15) 65%, transparent 100%)",
        }}
      />

      {/* Drifting purple glow — top */}
      <motion.div
        className="absolute -top-32 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.30), transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0.8, 1, 0.85, 1, 0.8],
          x: ["-50%", "-46%", "-54%", "-50%"],
          y: ["0%", "2%", "-2%", "0%"],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting cool glow — bottom-left */}
      <motion.div
        className="absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120, 180, 255, 0.18), transparent 70%)",
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drifting warm glow — bottom-right */}
      <motion.div
        className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255, 200, 140, 0.14), transparent 70%)",
        }}
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 20, -10, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette so the pattern fades cleanly into the page bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, hsl(var(--background)) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
