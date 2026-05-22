"use client";

import * as React from "react";
import {
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import type { Locale } from "@/lib/i18n-helpers";

interface ProjectItem {
  id: string;
  slug: string;
  coverImage: string | null;
  category: string;
  tags: string;
  titleEn: string;
  titleAr: string;
  shortDescEn: string;
  shortDescAr: string;
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
  const lockUntilRef = React.useRef(0);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, i));
    setIndex(clamped);
    lockUntilRef.current = Date.now() + 700;

    let targetLeft: number;
    if (clamped === 0) {
      targetLeft = 0;
    } else if (clamped === projects.length - 1) {
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
      if (Date.now() < lockUntilRef.current) return;
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

    // Convert vertical mouse-wheel scroll into horizontal panning.
    // Lets the page scroll keep flowing once we hit either edge.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const atStart = track.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = track.scrollLeft >= max && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      track.scrollBy({ left: e.deltaY });
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
    };
  }, [projects.length]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mx-6 flex snap-x snap-proximity gap-6 overflow-x-auto overscroll-x-contain px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollPadding: "0 24px",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            className="w-[clamp(280px,40vw,460px)] shrink-0 snap-center"
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
            disabled={index === projects.length - 1}
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
