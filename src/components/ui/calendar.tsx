"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays
      className={cn("p-3 text-tint", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute end-0 top-0 flex gap-1",
        button_previous:
          "h-7 w-7 rounded-md text-tint/60 hover:bg-tint/[0.06] hover:text-tint",
        button_next:
          "h-7 w-7 rounded-md text-tint/60 hover:bg-tint/[0.06] hover:text-tint",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs text-tint/40 font-normal",
        week: "flex w-full mt-1",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button:
          "inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-tint/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected:
          "[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:hover:bg-accent/90",
        today: "[&>button]:ring-1 [&>button]:ring-tint/20",
        outside: "text-tint/30",
        disabled: "text-tint/20 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  );
}
