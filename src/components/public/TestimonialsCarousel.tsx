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

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(track.children).forEach((c, i) => {
        const el = c as HTMLElement;
        const mid = el.offsetLeft + el.clientWidth / 2 - track.offsetLeft;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const dir = locale === "ar" ? -1 : 1;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPadding: "0 24px" }}
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
            onClick={() => scrollTo(Math.max(0, index - dir))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollTo(Math.min(items.length - 1, index + dir))}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.10] bg-white/[0.03] text-white/70 transition hover:border-white/30 hover:bg-white hover:text-black"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
