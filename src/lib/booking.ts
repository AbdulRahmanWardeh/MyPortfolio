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
 */
export async function getAvailableSlots(opts: {
  date: Date;
  meetingTypeId: string;
}): Promise<SlotInfo[]> {
  const day = startOfDay(opts.date);
  const dayOfWeek = day.getDay();

  const meetingType = await prisma.meetingType.findUnique({
    where: { id: opts.meetingTypeId },
  });
  if (!meetingType || !meetingType.isActive) return [];

  const blocked = await prisma.blockedDate.findFirst({ where: { date: day } });
  if (blocked) return [];

  if (isBefore(day, startOfDay(new Date()))) return [];

  const rules = await prisma.availabilityRule.findMany({
    where: { dayOfWeek, isActive: true },
    orderBy: { startTime: "asc" },
  });
  if (rules.length === 0) return [];

  const existing = await prisma.booking.findMany({
    where: {
      date: day,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  const taken = existing.map((b) => {
    const start = timeToMinutes(b.startTime);
    return { start, end: start + b.durationMinutes };
  });

  const duration = meetingType.durationMinutes;
  const slots: SlotInfo[] = [];

  for (const rule of rules) {
    const start = timeToMinutes(rule.startTime);
    const end = timeToMinutes(rule.endTime);

    for (let t = start; t + duration <= end; t += SLOT_STEP_MIN) {
      const slotEnd = t + duration;
      const overlaps = taken.some(
        (b) => !(slotEnd <= b.start || t >= b.end),
      );
      if (overlaps) continue;

      // Past-time on same-day check
      const now = new Date();
      if (
        day.toDateString() === now.toDateString() &&
        t <= now.getHours() * 60 + now.getMinutes()
      ) {
        continue;
      }

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
 */
export async function getAvailableDaysOfWeek(): Promise<number[]> {
  const rules = await prisma.availabilityRule.findMany({
    where: { isActive: true },
    distinct: ["dayOfWeek"],
    select: { dayOfWeek: true },
  });
  return rules.map((r) => r.dayOfWeek);
}

/**
 * Returns blocked dates (as YYYY-MM-DD strings) within a range.
 */
export async function getBlockedDates(from: Date, to: Date) {
  const rows = await prisma.blockedDate.findMany({
    where: { date: { gte: from, lte: to } },
  });
  return rows.map((r) => format(r.date, "yyyy-MM-dd"));
}

export function parseDateOnly(input: string) {
  return parse(input, "yyyy-MM-dd", new Date());
}

export function addBookingDuration(time: string, minutes: number) {
  const base = parse(time, "HH:mm", new Date());
  return format(addMinutes(base, minutes), "HH:mm");
}
