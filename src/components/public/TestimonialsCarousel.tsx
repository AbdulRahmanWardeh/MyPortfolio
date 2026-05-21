"use client";

import * as React from "react";
import Image from "next/image";
import {
  QuoteUpIcon as Quote,
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { pickField, type Locale } from "@/lib/i18n-helpers";

interface Testimonial {
  id: string;
  author: string;
  roleEn: string;
  roleAr: string;
  company: string;
  avatarUrl: string | null;
  quoteEn: string;
  quoteAr: string;
}

export function TestimonialsCarousel({
  items,
  locale,
}: {
  items: Testimonial[];
  locale: Locale;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  // Suppresses the scroll listener while we're animating a button-driven scroll,
  // so the dot we just chose isn't overwritten mid-animation.
  const lockUntilRef = React.useRef(0);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    setIndex(clamped);
    lockUntilRef.current = Date.now() + 700;

    let targetLeft: number;
    if (clamped === 0) {
      targetLeft = 0;
    } else if (clamped === items.length - 1) {
      targetLeft = track.scrollWidth;
    } else {
      const card = track.children[clamped] as HTMLElement | undefined;
      if (!card) return;
      const trackRect = track.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const offset = cardRect.left - trackRect.left;
      targetLeft =
        track.scrollLeft + offset - (track.clientWidth - card.clientWidth) / 2;
      targetLeft = Math.max(0, Math.min(track.scrollWidth, targetLeft));
    }
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const compute = () => {
      // Ignore listener-driven updates while a programmatic scroll is settling.
      if (Date.now() < lockUntilRef.current) return;

      // If nothing scrolls (cards fit), the active index is just 0 (start).
      if (track.scrollWidth - track.clientWidth < 2) {
        setIndex(0);
        return;
      }
      const trackRect = track.getBoundingClientRect();
      const centre = trackRect.left + trackRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((c, i) => {
        const r = (c as HTMLElement).getBoundingClientRect();
        const mid = r.left + r.width / 2;
        const d = Math.abs(mid - centre);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    // Start at 0 — do NOT auto-compute on mount, which would lock the centre
    // card (e.g. item 2 of 3) as the initial active state.
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-6 flex snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollPadding: "0 24px",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {items.map((tm) => (
          <figure
            key={tm.id}
            className="surface flex min-w-[min(420px,85vw)] snap-center flex-col gap-5 p-8"
          >
            <Quote className="h-5 w-5 text-accent" />
            <blockquote className="text-pretty text-base text-white/85 md:text-lg">
              &ldquo;{pickField(tm, locale, "quote")}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              {tm.avatarUrl ? (
                <Image
                  src={tm.avatarUrl}
                  alt={tm.author}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/[0.08]" />
              )}
              <div>
                <div className="text-sm font-medium">{tm.author}</div>
                <div className="text-xs text-white/50">
                  {pickField(tm, locale, "role")} · {tm.company}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === i ? "w-6 bg-white" : "w-1.5 bg-white/30",
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            disabled={index === 0}
            onClick={() => scrollTo(index - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/[0.03] disabled:hover:text-white/70"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={index === items.length - 1}
            onClick={() => scrollTo(index + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/[0.03] disabled:hover:text-white/70"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
