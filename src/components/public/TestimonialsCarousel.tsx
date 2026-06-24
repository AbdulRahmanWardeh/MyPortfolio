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
  company: string;
  avatarUrl: string | null;
  quoteEn: string;
}

export function TestimonialsCarousel({
  items,
  locale,
}: {
  items: Testimonial[];
  locale: Locale;
}) {
  const [index, setIndex] = React.useState(0);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [stageH, setStageH] = React.useState(0);

  // Track active card height for the stage container
  React.useLayoutEffect(() => {
    const el = cardRefs.current[index];
    if (!el) return;
    const measure = () => {
      const active = cardRefs.current[index];
      if (active) setStageH(active.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index]);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i)));

  return (
    // overflow-x-hidden here (not on the stage) so the cards can bleed
    // into the section padding before being clipped at the component edge
    <div className="overflow-x-hidden">
      {/* Stage — no overflow-hidden so cards aren't clipped inside the content box */}
      <div
        className="relative min-h-[220px] transition-[height] duration-500"
        style={{ height: stageH > 0 ? stageH : undefined }}
      >
        {items.map((tm, i) => {
          const offset = i - index;
          const visible = Math.abs(offset) <= 1;

          return (
            <figure
              key={tm.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => offset !== 0 && goTo(i)}
              className={cn(
                "surface absolute top-0 left-1/2",
                "w-[clamp(280px,38vw,440px)] flex-col gap-5 p-8",
                "transition-all duration-500 ease-in-out",
                // Only show side cards on sm+ — mobile shows just the active card
                offset === 0 ? "flex" : "hidden sm:flex",
                offset !== 0 && "cursor-pointer",
              )}
              style={{
                // 32vw shift ≈ 26 px gap at desktop, side cards 84 % visible
                transform: `translateX(calc(-50% + ${offset * 32}vw)) scale(${offset === 0 ? 1 : 0.82})`,
                opacity: visible ? (offset === 0 ? 1 : 0.70) : 0,
                zIndex: offset === 0 ? 10 : visible ? 5 : 0,
                pointerEvents: visible ? "auto" : "none",
              }}
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
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
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
            onClick={() => goTo(index - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/[0.03] disabled:hover:text-white/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={index === items.length - 1}
            onClick={() => goTo(index + 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/[0.03] disabled:hover:text-white/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
