"use client";

import * as React from "react";
import {
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import type { Locale } from "@/lib/i18n-helpers";

// Must match the px-6 padding on the track
const SCROLL_PAD = 24;

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string | null;
  category: string;
  tags: string;
  titleEn: string;
  shortDescEn: string;
}

export function ProjectsSwiper({
  projects,
  locale,
}: {
  projects: ProjectItem[];
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
      const c = Math.max(0, Math.min(projects.length - 1, i));
      setIndex(c);
      track.scrollTo({ left: snapLeftOf(c), behavior: "smooth" });
    },
    [projects.length, snapLeftOf],
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
  }, [projects.length, snapLeftOf]);

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
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
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
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "w-[clamp(280px,40vw,460px)] shrink-0 snap-start transition-opacity duration-300",
              i === index ? "opacity-100" : "opacity-35",
            )}
          >
            <ProjectCard project={p} locale={locale} />
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
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
            disabled={index === projects.length - 1}
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
