import * as React from "react";

/**
 * Pure-CSS "falling glow particles" confined to two small corner zones at the
 * top-left and top-right of the viewport. Position is `fixed` so they never
 * scroll with the page, and the spawn area is bounded — particles can't
 * reach the middle/bottom of the screen.
 */

interface ParticleSpec {
  x: number; // % within the corner zone (0 = flush against the corner edge)
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds — negative to seed mid-cycle
  drift: number; // px inward drift (positive = toward the center)
  opacity: number; // peak opacity 0..1
}

// Within each corner container, x is measured from the outer edge.
const CLUSTER: ParticleSpec[] = [
  { x: 4, size: 3, duration: 14, delay: 0, drift: 40, opacity: 0.5 },
  { x: 12, size: 2, duration: 16, delay: -4, drift: 70, opacity: 0.35 },
  { x: 20, size: 4, duration: 12, delay: -7, drift: 90, opacity: 0.55 },
  { x: 8, size: 2, duration: 15, delay: -10, drift: 30, opacity: 0.3 },
  { x: 28, size: 3, duration: 13, delay: -2, drift: 110, opacity: 0.45 },
  { x: 16, size: 3, duration: 17, delay: -12, drift: 60, opacity: 0.4 },
  { x: 2, size: 2, duration: 18, delay: -6, drift: 130, opacity: 0.3 },
  { x: 24, size: 4, duration: 14, delay: -9, drift: 80, opacity: 0.5 },
  { x: 10, size: 2, duration: 16, delay: -3, drift: 100, opacity: 0.35 },
  { x: 18, size: 3, duration: 13, delay: -11, drift: 50, opacity: 0.45 },
  { x: 6, size: 4, duration: 15, delay: -1, drift: 95, opacity: 0.55 },
  { x: 22, size: 2, duration: 17, delay: -8, drift: 40, opacity: 0.3 },
];

export function FallingParticles() {
  return (
    <>
      <div className="falling-particles falling-particles--left" aria-hidden>
        {CLUSTER.map((p, i) => (
          <span
            key={`l-${i}`}
            className="particle"
            style={
              {
                "--p-x": `${p.x}%`,
                "--p-size": `${p.size}px`,
                "--p-duration": `${p.duration}s`,
                "--p-delay": `${p.delay}s`,
                "--p-drift": `${p.drift}px`,
                "--p-opacity": p.opacity,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="falling-particles falling-particles--right" aria-hidden>
        {CLUSTER.map((p, i) => (
          <span
            key={`r-${i}`}
            className="particle"
            style={
              {
                "--p-x": `${p.x}%`,
                "--p-size": `${p.size}px`,
                "--p-duration": `${p.duration + 1}s`,
                "--p-delay": `${p.delay - 3}s`,
                "--p-drift": `${-p.drift}px`,
                "--p-opacity": p.opacity,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}
