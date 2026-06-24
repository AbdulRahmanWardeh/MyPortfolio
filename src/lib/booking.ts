import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { addMinutes, format, isBefore, parse, startOfDay } from "date-fns";

export interface SlotInfo {
  time: string; // "HH:mm"
  iso: string;
}

const SLOT_STEP_MIN = 30;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Returns available slot start times for a given date and meeting duration.
 * Excludes overlapping bookings (any status except CANCELLED) and blocked dates.
 *
 * The four read queries that don't depend on each other are dispatched in
 * parallel — previously they ran in sequence and added up to four roundtrips.
 */
export async function getAvailableSlots(opts: {
  date: Date;
  meetingTypeId: string;
}): Promise<SlotInfo[]> {
  const day = startOfDay(opts.date);
  const dayOfWeek = day.getDay();

  if (isBefore(day, startOfDay(new Date()))) return [];

  const [meetingType, blocked, rules, existing] = await Promise.all([
    prisma.meetingType.findUnique({ where: { id: opts.meetingTypeId } }),
    prisma.blockedDate.findFirst({ where: { date: day } }),
    prisma.availabilityRule.findMany({
      where: { dayOfWeek, isActive: true },
      orderBy: { startTime: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        date: day,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { startTime: true, durationMinutes: true },
    }),
  ]);

  if (!meetingType || !meetingType.isActive) return [];
  if (blocked) return [];
  if (rules.length === 0) return [];

  const taken = existing.map((b) => {
    const start = timeToMinutes(b.startTime);
    return { start, end: start + b.durationMinutes };
  });

  const duration = meetingType.durationMinutes;
  const slots: SlotInfo[] = [];

  const now = new Date();
  const isToday = day.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const rule of rules) {
    const start = timeToMinutes(rule.startTime);
    const end = timeToMinutes(rule.endTime);

    for (let t = start; t + duration <= end; t += SLOT_STEP_MIN) {
      const slotEnd = t + duration;
      const overlaps = taken.some(
        (b) => !(slotEnd <= b.start || t >= b.end),
      );
      if (overlaps) continue;
      if (isToday && t <= nowMinutes) continue;

      const time = minutesToTime(t);
      const iso = new Date(
        Date.UTC(
          day.getFullYear(),
          day.getMonth(),
          day.getDate(),
          Math.floor(t / 60),
          t % 60,
        ),
      ).toISOString();
      slots.push({ time, iso });
    }
  }

  return slots;
}

/**
 * Returns weekdays (0-6) that have at least one active availability rule.
 * Cached: availability rules rarely change, so the few rows we read here
 * are safe to share across requests.
 */
export const getAvailableDaysOfWeek = cache(
  unstable_cache(
    async (): Promise<number[]> => {
      const rules = await prisma.availabilityRule.findMany({
        where: { isActive: true },
        distinct: ["dayOfWeek"],
        select: { dayOfWeek: true },
      });
      return rules.map((r) => r.dayOfWeek);
    },
    ["available-days-of-week"],
    { revalidate: 300, tags: ["availability"] },
  ),
);

/**
 * Returns blocked dates (YYYY-MM-DD) within a range. Cached per (from, to)
 * tuple — admin mutations should call revalidateTag("availability").
 */
export const getBlockedDates = cache(async (from: Date, to: Date) => {
  const key = `${from.toISOString().slice(0, 10)}_${to.toISOString().slice(0, 10)}`;
  return unstable_cache(
    async () => {
      const rows = await prisma.blockedDate.findMany({
        where: { date: { gte: from, lte: to } },
        select: { date: true },
      });
      return rows.map((r) => format(r.date, "yyyy-MM-dd"));
    },
    ["blocked-dates", key],
    { revalidate: 300, tags: ["availability"] },
  )();
});

export function parseDateOnly(input: string) {
  return parse(input, "yyyy-MM-dd", new Date());
}

export function addBookingDuration(time: string, minutes: number) {
  const base = parse(time, "HH:mm", new Date());
  return format(addMinutes(base, minutes), "HH:mm");
}
