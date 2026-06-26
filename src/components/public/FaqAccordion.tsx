"use client";

import * as React from "react";
import { Add01Icon as Plus } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { pickField, type Locale } from "@/lib/i18n-helpers";

interface FaqItem {
  id: string;
  questionEn: string;
  answerEn: string;
}

export function FaqAccordion({
  items,
  locale,
}: {
  items: FaqItem[];
  locale: Locale;
}) {
  // First item open by default; click a row to toggle it (single-open).
  const [open, setOpen] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "surface overflow-hidden rounded-2xl transition-all duration-300",
              isOpen
                ? "bg-accent/[0.05] shadow-[inset_0_18px_26px_-18px_hsl(var(--accent)/0.5)]"
                : "hover:bg-tint/[0.04]",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <span className="text-base font-medium text-tint md:text-lg">
                {pickField(item, locale, "question")}
              </span>
              <Plus
                className={cn(
                  "h-5 w-5 shrink-0 text-tint/50 transition-transform duration-300",
                  isOpen && "rotate-45 text-accent",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="text-pretty px-6 pb-6 text-sm text-tint/60 md:text-base">
                  {pickField(item, locale, "answer")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
