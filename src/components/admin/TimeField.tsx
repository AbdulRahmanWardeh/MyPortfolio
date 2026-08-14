"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = ["00", "15", "30", "45"];

type Period = "AM" | "PM";

/** Parse a stored 24h "HH:mm" string into 12-hour parts. */
function parse24h(value: string): { hour: number; minute: string; period: Period } {
  const [hRaw, mRaw] = (value || "09:00").split(":");
  let h = parseInt(hRaw, 10);
  if (!Number.isFinite(h)) h = 9;
  const period: Period = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;

  let minute = (mRaw ?? "00").padStart(2, "0");
  if (!MINUTES.includes(minute)) {
    // snap arbitrary minutes to the nearest 15-minute option
    const mNum = parseInt(minute, 10) || 0;
    minute = MINUTES.reduce((best, cur) =>
      Math.abs(parseInt(cur, 10) - mNum) < Math.abs(parseInt(best, 10) - mNum)
        ? cur
        : best,
    );
  }
  return { hour: hour12, minute, period };
}

/** Compose 12-hour parts back into a stored 24h "HH:mm" string. */
function to24h(hour12: number, minute: string, period: Period): string {
  let h = hour12 % 12; // 12 -> 0
  if (period === "PM") h += 12; // PM 12 -> 12, PM 1..11 -> 13..23
  return `${String(h).padStart(2, "0")}:${minute}`;
}

/**
 * 12-hour time picker (hour / minute / AM-PM) that submits a hidden 24h
 * "HH:mm" value under `name`, so server-side storage & booking logic are
 * unchanged.
 */
export function TimeField({
  name,
  label,
  defaultValue = "09:00",
}: {
  name: string;
  label?: string;
  defaultValue?: string;
}) {
  const init = React.useMemo(() => parse24h(defaultValue), [defaultValue]);
  const [hour, setHour] = React.useState(init.hour);
  const [minute, setMinute] = React.useState(init.minute);
  const [period, setPeriod] = React.useState<Period>(init.period);

  const value = to24h(hour, minute, period);

  return (
    <div className="flex flex-col gap-2">
      {label ? <Label>{label}</Label> : null}
      <div className="grid grid-cols-[1fr_1fr_1fr] items-center gap-2">
        <Select value={String(hour)} onValueChange={(v) => setHour(parseInt(v, 10))}>
          <SelectTrigger aria-label="Hour">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOURS.map((h) => (
              <SelectItem key={h} value={String(h)}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={minute} onValueChange={setMinute}>
          <SelectTrigger aria-label="Minute">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger aria-label="AM or PM">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
