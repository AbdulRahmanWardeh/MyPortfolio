import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string,
  locale: string = "en",
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", opts).format(d);
}

export function formatMonthYear(date: Date | string | null | undefined, locale = "en") {
  if (!date) return locale === "ar" ? "حتى الآن" : "Present";
  return formatDate(date, locale, { year: "numeric", month: "short" });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n).trimEnd() + "…" : str;
}

/**
 * Parses a JSON field that may already be deserialized (Postgres Json) or a string (SQLite).
 * Returns the fallback if invalid.
 */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function isoDay(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}
