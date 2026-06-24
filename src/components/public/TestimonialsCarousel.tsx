"use client";

import * as React from "react";
import Image from "next/image";
import { QuoteUpIcon as Quote } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { CarouselControls } from "./CarouselControls";

interface Testimonial {
  id: string;
  author: string;
  roleEn: string;
  company: string;
  avatarUrl: string | null;
  quoteEn: string;
}

// Horizontal drag distance (px) required to advance a slide.
const SWIPE_THRESHOLD = 60;
// Distance between adjacent cards — card width + a small gap. Tight so the
// cards sit beside each other rather than spread apart.
const STEP = "calc(clamp(280px, 38vw, 440px) + 0.75rem)";

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

  const goTo = React.useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i))),
    [items.length],
  );

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

  // ---- Drag / swipe ------------------------------------------------------
  const drag = React.useRef({ active: false, startX: 0, dx: 0 });
  const [dragging, setDragging] = React.useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, startX: e.clientX, dx: 0 };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    drag.current.dx = e.clientX - drag.current.startX;
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    const { dx } = drag.current;
    drag.current.active = false;
    setDragging(false);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      goTo(index + (dx < 0 ? 1 : -1));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    else if (e.key === "ArrowRight") goTo(index + 1);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Stage — the active card is centered with its neighbours close
          beside it on each side. */}
      <div
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className={cn(
          "relative min-h-[220px] touch-pan-y select-none transition-[height] duration-500 focus-visible:outline-none",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
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
                // Only show the active card on mobile; reveal neighbours on sm+
                offset === 0 ? "flex" : "hidden sm:flex",
                offset !== 0 && "cursor-pointer",
              )}
              style={{
                transform: `translateX(calc(-50% + ${offset} * ${STEP})) scale(${offset === 0 ? 1 : 0.92})`,
                opacity: visible ? (offset === 0 ? 1 : 0.55) : 0,
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

      <CarouselControls
        count={items.length}
        index={index}
        onSelect={goTo}
        dotLabel="Go to testimonial"
        className="mt-6"
      />
    </div>
  );
}
