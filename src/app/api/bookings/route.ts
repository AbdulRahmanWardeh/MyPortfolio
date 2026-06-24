import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAvailableSlots } from "@/lib/booking";
import { sendBookingEmails } from "@/lib/resend";

const bodySchema = z.object({
  meetingTypeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().min(1).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(4000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;

  const meetingType = await prisma.meetingType.findUnique({
    where: { id: data.meetingTypeId },
  });
  if (!meetingType || !meetingType.isActive) {
    return NextResponse.json({ error: "Meeting type not available" }, { status: 400 });
  }

  const date = new Date(data.date);
  date.setUTCHours(0, 0, 0, 0);

  // Re-verify slot is still available
  const slots = await getAvailableSlots({ date, meetingTypeId: meetingType.id });
  if (!slots.some((s) => s.time === data.startTime)) {
    return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      meetingTypeId: meetingType.id,
      date,
      startTime: data.startTime,
      durationMinutes: meetingType.durationMinutes,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      message: data.message || null,
    },
  });

  // Fire-and-await emails (failures are logged but don't fail the response)
  await sendBookingEmails({
    name: booking.name,
    email: booking.email,
    meetingTypeName: meetingType.nameEn,
    date: data.date,
    startTime: data.startTime,
    durationMinutes: meetingType.durationMinutes,
    company: booking.company,
    phone: booking.phone,
    message: booking.message,
  });

  return NextResponse.json({ ok: true, id: booking.id });
}
