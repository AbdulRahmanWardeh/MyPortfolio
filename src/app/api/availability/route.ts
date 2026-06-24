import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/booking";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const meetingTypeId = searchParams.get("meetingTypeId");
  if (!date || !meetingTypeId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  const slots = await getAvailableSlots({
    date: new Date(date),
    meetingTypeId,
  });
  return NextResponse.json({ slots });
}
