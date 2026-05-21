/**
 * Decorative backdrop for the hero. Server component — all animation is
 * pure CSS (no Framer Motion runtime). Sits at -z-10 below content.
 *
 *  - Soft dotted grid with top→bottom opacity fade (mask).
 *  - Three drifting glow orbs animated with @keyframes.
 *  - Vignette to blend the bottom edge into the page bg.
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
      <div className="hero-orb hero-orb--purple" />

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
