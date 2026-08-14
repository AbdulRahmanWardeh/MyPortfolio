"use client";

import * as React from "react";
import { Add01Icon as Plus } from "hugeicons-react";
import { cn, parseJson } from "@/lib/utils";
import { normalizeBlocks } from "@/lib/blocks";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { BlockRenderer } from "./BlockRenderer";

export interface RenderableSection {
  id: string;
  order: number;
  titleEn: string;
  bodyEn: string;
  blocks: unknown;
}

/**
 * Offsets, kept in one place because three things have to agree: where the
 * rail pins, how far `scrollIntoView` backs off, and where the scroll-spy
 * considers a section "current". The site navbar is a floating pill —
 * pt-4 + h-16 = 80px on mobile, pt-6 + h-16 = 88px on desktop — so the rail
 * pins just below that, and the scroll offsets clear the rail on top of it.
 */
const RAIL_TOP = "top-[84px] md:top-[96px]";
const SECTION_SCROLL_MT = "scroll-mt-[152px] md:scroll-mt-[168px]";
/** Matches SECTION_SCROLL_MT — a section is "current" once it clears the rail. */
const SPY_ROOT_MARGIN = "-160px 0px -55% 0px";

/**
 * Case-study sections as a full-width accordion, with a sticky rail of section
 * chips pinned under the site navbar.
 *
 * Collapsed panels stay mounted and are clipped with a `grid-rows` transition
 * rather than unmounted, so the full case study is still present for crawlers,
 * in-page search (Ctrl+F) and deep links.
 */
export function ProjectSections({
  sections,
  locale,
  heading,
}: {
  sections: RenderableSection[];
  locale: Locale;
  /** Accessible name for the rail. Not rendered — the rail is chips only. */
  heading?: string;
}) {
  const ordered = React.useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  );

  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(ordered[0] ? [ordered[0].id] : []),
  );
  const [active, setActive] = React.useState<string | null>(
    ordered[0]?.id ?? null,
  );
  const refs = React.useRef<Record<string, HTMLElement | null>>({});
  const chipRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const railRef = React.useRef<HTMLDivElement>(null);

  const allOpen = open.size === ordered.length && ordered.length > 0;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const goTo = React.useCallback((id: string) => {
    setOpen((prev) => new Set(prev).add(id));
    setActive(id);
    // Let the panel expand before measuring the scroll target.
    requestAnimationFrame(() => {
      refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // Open + jump to a section referenced by the URL hash (#section-<n>).
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = Number(hash.replace("section-", "")) - 1;
    const target = ordered[idx];
    if (target) goTo(target.id);
  }, [ordered, goTo]);

  // Highlight whichever section is currently nearest the top of the viewport.
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.sectionId) {
          setActive(visible.target.dataset.sectionId);
        }
      },
      { rootMargin: SPY_ROOT_MARGIN, threshold: 0 },
    );
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [ordered]);

  // A long case study overflows the rail, so keep the current chip on screen.
  // Scrolls the rail itself rather than using scrollIntoView, which would also
  // yank the page vertically.
  React.useEffect(() => {
    if (!active) return;
    const chip = chipRefs.current[active];
    const rail = railRef.current;
    if (!chip || !rail) return;
    const target = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
    rail.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth",
    });
  }, [active]);

  if (ordered.length === 0) return null;

  return (
    <div>
      {/* Sticky rail — pinned under the navbar, scrolls horizontally when the
          chips overflow. Blurred so content passing underneath stays legible. */}
      <nav
        aria-label={heading ?? "Sections"}
        className={cn("sticky z-30 mb-6", RAIL_TOP)}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-tint/[0.10] bg-background/70 p-2 shadow-[inset_0_1px_0_rgb(var(--tint)/0.08),0_8px_24px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150">
          <div
            ref={railRef}
            className="flex flex-1 gap-1.5 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ordered.map((s, i) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  ref={(el) => {
                    chipRefs.current[s.id] = el;
                  }}
                  onClick={() => goTo(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs transition",
                    isActive
                      ? "border-accent/40 bg-accent/15 text-accent"
                      : "border-transparent text-tint/60 hover:bg-tint/[0.05] hover:text-tint",
                  )}
                >
                  <span className="font-mono text-[0.65rem] opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-[14ch] truncate sm:max-w-[22ch]">
                    {pickField(s, locale, "title")}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() =>
              setOpen(allOpen ? new Set() : new Set(ordered.map((s) => s.id)))
            }
            className="shrink-0 whitespace-nowrap rounded-xl border border-tint/[0.10] px-3 py-1.5 text-xs text-tint/60 transition hover:bg-tint/[0.05] hover:text-tint"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </nav>

      {/* Accordion — full width now that the rail sits above it */}
      <div className="flex flex-col gap-3">
        {ordered.map((section, idx) => {
          const isOpen = open.has(section.id);
          const blocks = normalizeBlocks(parseJson<unknown[]>(section.blocks, []));
          const body = pickField(section, locale, "body");

          return (
            <section
              key={section.id}
              id={`section-${idx + 1}`}
              data-section-id={section.id}
              ref={(el) => {
                refs.current[section.id] = el;
              }}
              className={cn(
                "surface surface-soft overflow-hidden rounded-2xl bg-card transition-all duration-300",
                SECTION_SCROLL_MT,
              )}
            >
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`section-panel-${idx + 1}`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-tint/30">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-display text-lg font-semibold md:text-xl">
                      {pickField(section, locale, "title")}
                    </span>
                  </span>
                  <Plus
                    className={cn(
                      "h-5 w-5 shrink-0 text-tint/50 transition-transform duration-300",
                      isOpen && "rotate-45 text-accent",
                    )}
                  />
                </button>
              </h2>

              <div
                id={`section-panel-${idx + 1}`}
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <hr className="border-tint/10" />
                  <div className="px-6 pb-7 pt-5">
                    {body ? (
                      <p className="max-w-3xl whitespace-pre-line text-pretty text-base text-tint/70">
                        {body}
                      </p>
                    ) : null}
                    {blocks.length > 0 ? (
                      <div className="mt-6 flex flex-col gap-6">
                        {blocks.map((block, i) => (
                          <BlockRenderer key={i} block={block} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
