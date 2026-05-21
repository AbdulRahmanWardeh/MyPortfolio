import * as React from "react";

/**
 * Single inline animated ribbon — sits in the hero content flow,
 * replacing the static subtitle. Bleeds to the full viewport width
 * regardless of the centered column's max-width.
 */
const ROLES = [
  "UX UI Designer",
  "UX Researcher",
  "Product Designer",
  "Service Designer",
];

// Repeat the role list enough times to guarantee the track is wider than the viewport.
const REPEAT = 4;

export function HeroRibbon() {
  const items = Array.from({ length: REPEAT }, () => ROLES).flat();

  return (
    <div className="hero-ribbon">
      <div className="ribbon">
        <div className="ribbon-track ribbon-track--left">
          {items.map((t, i) => (
            <span key={`a-${i}`}>{t}</span>
          ))}
          {items.map((t, i) => (
            <span key={`b-${i}`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
