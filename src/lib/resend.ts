import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY ?? "";
const fromAddress = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? "";

const resend = apiKey ? new Resend(apiKey) : null;

interface BookingEmailInput {
  name: string;
  email: string;
  meetingTypeName: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  company?: string | null;
  phone?: string | null;
  message?: string | null;
}

export async function sendBookingEmails(input: BookingEmailInput) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY missing — skipping booking emails");
    return;
  }

  const visitorHtml = `
    <div style="font-family:ui-sans-serif,system-ui;background:#0a0a0a;color:#fff;padding:40px;border-radius:24px;max-width:560px;margin:auto">
      <h1 style="font-size:24px;margin:0 0 8px">Your meeting is requested</h1>
      <p style="color:#a3a3a3;margin:0 0 24px">Thanks ${escapeHtml(input.name)} — I'll confirm shortly.</p>
      <div style="background:#141414;border:1px solid #262626;border-radius:16px;padding:24px;margin-bottom:16px">
        <p style="margin:0 0 8px"><strong>${escapeHtml(input.meetingTypeName)}</strong> · ${input.durationMinutes} min</p>
        <p style="margin:0;color:#a3a3a3">${escapeHtml(input.date)} · ${escapeHtml(input.startTime)}</p>
      </div>
      <p style="color:#a3a3a3;font-size:13px">If anything changes, just reply to this email.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:ui-sans-serif,system-ui;padding:24px">
      <h2 style="margin:0 0 12px">New booking from ${escapeHtml(input.name)}</h2>
      <ul style="line-height:1.7">
        <li><strong>Type:</strong> ${escapeHtml(input.meetingTypeName)} (${input.durationMinutes} min)</li>
        <li><strong>When:</strong> ${escapeHtml(input.date)} at ${escapeHtml(input.startTime)}</li>
        <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
        ${input.phone ? `<li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>` : ""}
        ${input.company ? `<li><strong>Company:</strong> ${escapeHtml(input.company)}</li>` : ""}
      </ul>
      ${input.message ? `<p><strong>Message:</strong><br/>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>` : ""}
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  tasks.push(
    resend.emails
      .send({
        from: fromAddress,
        to: input.email,
        subject: `Your ${input.meetingTypeName} request`,
        html: visitorHtml,
      })
      .catch((e) => console.error("[resend] visitor email failed", e)),
  );

  if (adminEmail) {
    tasks.push(
      resend.emails
        .send({
          from: fromAddress,
          to: adminEmail,
          subject: `New booking: ${input.name} — ${input.meetingTypeName}`,
          html: adminHtml,
        })
        .catch((e) => console.error("[resend] admin email failed", e)),
    );
  }

  await Promise.allSettled(tasks);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
