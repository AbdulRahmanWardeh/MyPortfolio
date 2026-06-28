"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
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

export function TestimonialsCarousel({
  items,
  locale,
}: {
  items: Testimonial[];
  locale: Locale;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: false });
  const [index, setIndex] = React.useState(0);
  const [canScroll, setCanScroll] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    const onScrollable = () =>
      setCanScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());

    emblaApi.on("select", onSelect);
    emblaApi.on("resize", onScrollable);
    emblaApi.on("reInit", onScrollable);

    onSelect();
    onScrollable();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("resize", onScrollable);
      emblaApi.off("reInit", onScrollable);
    };
  }, [emblaApi]);

  const goTo = React.useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="-mx-6 overflow-hidden select-none"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0px, black 24px, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0px, black 24px, black 94%, transparent 100%)",
        }}
      >
        <div className="flex items-stretch gap-6 px-6 pb-6">
          {items.map((tm, i) => (
            <figure
              key={tm.id}
              className={cn(
                "surface flex w-[clamp(280px,38vw,440px)] shrink-0 flex-col gap-5 p-8 transition-opacity duration-300",
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
      </div>

      {canScroll && (
        <CarouselControls
          count={items.length}
          index={index}
          onSelect={goTo}
          dotLabel="Go to testimonial"
          className="mt-2"
        />
      )}
    </div>
  );
}
