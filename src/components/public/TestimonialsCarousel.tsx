"use client";

import * as React from "react";
import Image from "next/image";
import { QuoteUpIcon as Quote } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { CarouselControls } from "./CarouselControls";

// Must match the px-6 padding on the track
const SCROLL_PAD = 24;

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
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);

  // Drag state
  const dragRef = React.useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const didDragRef = React.useRef(false);

  // Compute the correct scrollLeft that places card i at the snap-start edge
  const snapLeftOf = React.useCallback((i: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const el = track.children[i] as HTMLElement | undefined;
    if (!el) return 0;
    return Math.max(
      0,
      Math.min(track.scrollWidth - track.clientWidth, el.offsetLeft - SCROLL_PAD),
    );
  }, []);

  const goTo = React.useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const c = Math.max(0, Math.min(items.length - 1, i));
      setIndex(c);
      track.scrollTo({ left: snapLeftOf(c), behavior: "smooth" });
    },
    [items.length, snapLeftOf],
  );

  // Keep dot in sync with scroll position
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      const sl = track.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const dist = Math.abs(sl - snapLeftOf(i));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setIndex(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length, snapLeftOf]);

  // Vertical wheel → horizontal scroll
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      if (track.scrollLeft <= 0 && e.deltaY < 0) return;
      if (track.scrollLeft >= max && e.deltaY > 0) return;
      e.preventDefault();
      track.scrollBy({ left: e.deltaY });
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startLeft: track.scrollLeft,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = d.startX - e.clientX;
    if (Math.abs(dx) > 5) d.moved = true;
    track.scrollLeft = d.startLeft + dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    e.currentTarget.style.cursor = "";

    if (d.moved) {
      didDragRef.current = true;
      const track = trackRef.current;
      if (!track) return;
      // Snap to the nearest card
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < track.children.length; i++) {
        const dist = Math.abs(track.scrollLeft - snapLeftOf(i));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      goTo(best);
    }
  };

  // Prevent child link clicks from firing after a drag
  const onClickCapture = (e: React.MouseEvent) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-6 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto overscroll-x-contain px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
        style={{
          scrollPaddingLeft: `${SCROLL_PAD}px`,
          scrollBehavior: "smooth",
          cursor: "grab",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        {items.map((tm, i) => (
          <figure
            key={tm.id}
            className={cn(
              "surface flex w-[clamp(280px,38vw,440px)] shrink-0 flex-col gap-5 p-8 transition-opacity duration-300",
              i === items.length - 1 ? "snap-end" : "snap-start",
              i === index ? "opacity-100" : "opacity-40",
            )}
          >
            <Quote className="h-5 w-5 text-accent" />
            <blockquote className="text-pretty text-base text-tint/85 md:text-lg">
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
                <div className="h-10 w-10 rounded-full bg-tint/[0.08]" />
              )}
              <div>
                <div className="text-sm font-medium">{tm.author}</div>
                <div className="text-xs text-tint/50">
                  {pickField(tm, locale, "role")} · {tm.company}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      <CarouselControls
        count={items.length}
        index={index}
        onSelect={goTo}
        dotLabel="Go to testimonial"
        className="mt-2"
      />
    </div>
  );
}
