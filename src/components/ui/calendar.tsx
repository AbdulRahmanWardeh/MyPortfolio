"use client";

import * as React from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function DayButton({ day, modifiers: _modifiers, children, ...props }: DayButtonProps) {
  const isFirstOfMonth = day.date.getDate() === 1;
  return (
    <button {...props}>
      {isFirstOfMonth ? (
        <span className="pointer-events-none absolute inset-x-0 top-1.5 text-center text-[0.6rem] font-semibold uppercase leading-none tracking-wide text-tint/50">
          {format(day.date, "MMM")}
        </span>
      ) : null}
      {children}
    </button>
  );
}

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3 text-tint", className)}
      components={{ DayButton }}
      classNames={{
        months: "relative flex flex-col gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex h-10 items-center justify-center",
        caption_label: "text-base font-semibold",
        nav: "absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between",
        button_previous:
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 touch-manipulation transition-transform hover:bg-zinc-50 active:scale-90",
        button_next:
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 touch-manipulation transition-transform hover:bg-zinc-50 active:scale-90",
        month_grid: "w-full border-collapse",
        weekdays: "flex gap-1.5",
        weekday:
          "w-14 text-center text-xs font-semibold uppercase tracking-wide text-tint/45",
        week: "flex w-full gap-1.5 mt-1.5",
        day: "relative h-14 w-14 p-0 text-center text-base",
        day_button:
          "relative inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 font-medium text-tint touch-manipulation transition-colors hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected:
          "[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:hover:bg-accent",
        today:
          "after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-tint after:content-['']",
        outside:
          "[&>button]:bg-transparent [&>button]:text-tint/25 [&>button]:hover:bg-transparent",
        disabled:
          "[&>button]:bg-transparent [&>button]:text-tint/20 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
