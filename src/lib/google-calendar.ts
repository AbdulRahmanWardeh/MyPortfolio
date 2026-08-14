import { google } from "googleapis";
import {
  createOAuthClient,
  googleConfig,
  isGoogleCalendarConfigured,
} from "@/lib/google";

interface CreateEventInput {
  bookingId: string;
  meetingTypeName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  durationMinutes: number;
  name: string;
  email: string;
  message?: string | null;
}

interface CreatedEvent {
  meetingLink: string | null;
  eventId: string | null;
}

/**
 * End of the meeting as a { date, time } pair.
 *
 * A late slot can run past midnight — 23:45 + 30min. Wrapping the clock but
 * keeping the original date would put the end *before* the start and Google
 * rejects the event, so the date has to roll forward with it. The UTC helpers
 * are only doing calendar arithmetic on wall-clock values; the real zone is
 * sent alongside as `timeZone`.
 */
function addMinutes(date: string, time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, d] = date.split("-").map(Number);
  const end = new Date(Date.UTC(y, mo - 1, d, h, m + minutes));
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(end.getUTCDate())}`,
    time: `${pad(end.getUTCHours())}:${pad(end.getUTCMinutes())}`,
  };
}

/**
 * Creates a Google Calendar event with an auto-generated Google Meet link and
 * the visitor added as a guest. Returns the Meet link + event id, or nulls if
 * Google isn't configured / the call fails (booking should still succeed).
 */
export async function createMeetingEvent(
  input: CreateEventInput,
): Promise<CreatedEvent> {
  if (!isGoogleCalendarConfigured()) {
    console.warn(
      "[google] Calendar not configured — skipping Meet link generation",
    );
    return { meetingLink: null, eventId: null };
  }

  try {
    const auth = createOAuthClient();
    auth.setCredentials({ refresh_token: googleConfig.refreshToken });
    const calendar = google.calendar({ version: "v3", auth });

    const end = addMinutes(input.date, input.startTime, input.durationMinutes);

    const res = await calendar.events.insert({
      calendarId: googleConfig.calendarId,
      conferenceDataVersion: 1,
      sendUpdates: "all", // emails the guest a calendar invite too
      requestBody: {
        summary: `${input.meetingTypeName} with ${input.name}`,
        description: input.message
          ? `Booking message:\n${input.message}`
          : `Booked via portfolio site.`,
        start: {
          dateTime: `${input.date}T${input.startTime}:00`,
          timeZone: googleConfig.timeZone,
        },
        end: {
          dateTime: `${end.date}T${end.time}:00`,
          timeZone: googleConfig.timeZone,
        },
        attendees: [{ email: input.email, displayName: input.name }],
        conferenceData: {
          createRequest: {
            requestId: input.bookingId, // idempotency key
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const meetingLink =
      res.data.hangoutLink ??
      res.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video",
      )?.uri ??
      null;

    return { meetingLink, eventId: res.data.id ?? null };
  } catch (e) {
    console.error("[google] failed to create calendar event", e);
    return { meetingLink: null, eventId: null };
  }
}
