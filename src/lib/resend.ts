import { Resend } from "resend";
import { format, parse } from "date-fns";

const apiKey = process.env.RESEND_API_KEY ?? "";
const fromAddress = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
const adminEmails = (process.env.ADMIN_NOTIFY_EMAIL ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
// Logo must be a public URL to render in real inboxes. Override with
// EMAIL_LOGO_URL (e.g. a GitHub raw / CDN link) when running on localhost.
const logoUrl = process.env.EMAIL_LOGO_URL || `${siteUrl}/logo-email.png`;

// Brand palette
const C = {
  navy: "#0a162e",
  ink: "#18181b",
  muted: "#6b7280",
  faint: "#9ca3af",
  accent: "#8b5cf6",
  accentDark: "#7c3aed",
  bg: "#eef0f4",
  card: "#ffffff",
  line: "#ecebf3",
  softViolet: "#f5f3ff",
};

const SOCIALS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/aawardeh/", icon: "linkedin" },
  { name: "Behance", url: "https://www.behance.net/abdulrawardeh", icon: "behance" },
  { name: "Email", url: "mailto:info@awardeh.me", icon: "gmail" },
  { name: "WhatsApp", url: "https://wa.me/962788524504", icon: "whatsapp" },
];

const resend = apiKey ? new Resend(apiKey) : null;

interface BookingEmailInput {
  name: string;
  email: string;
  meetingTypeName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  company?: string | null;
  phone?: string | null;
  message?: string | null;
  meetingLink?: string | null;
}

export async function sendBookingEmails(input: BookingEmailInput) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY missing — skipping booking emails");
    return;
  }

  // Send sequentially to stay under Resend's free-tier rate limit, and inspect
  // the returned `error` field (the SDK resolves, not throws, on API errors).
  await sendOne("visitor", {
    from: fromAddress,
    to: input.email,
    subject: `Your ${input.meetingTypeName} is booked ✓`,
    html: visitorEmail(input),
  });

  if (adminEmails.length > 0) {
    await sendOne("admin", {
      from: fromAddress,
      to: adminEmails,
      subject: `New booking · ${input.name} — ${input.meetingTypeName}`,
      html: adminEmail(input),
    });
  }
}

/* ----------------------------- templates ----------------------------- */

function visitorEmail(input: BookingEmailInput) {
  const { dateLabel, timeLabel } = formatWhen(
    input.date,
    input.startTime,
    input.durationMinutes,
  );

  const body = `
    ${pill("Meeting requested")}
    <h1 style="margin:8px 0 6px;font-size:26px;line-height:1.25;color:${C.ink};font-weight:700">
      Thanks, ${escapeHtml(input.name)} 👋
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${C.muted}">
      Your booking is in — I'll confirm shortly. Here are the details:
    </p>

    ${detailsCard([
      ["Service", `${escapeHtml(input.meetingTypeName)}`],
      ["Date", dateLabel],
      ["Time", timeLabel],
    ])}

    ${
      input.meetingLink
        ? `${button("Join Google Meet", input.meetingLink)}
           <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:${C.faint};word-break:break-all">
             Or copy this link: <a href="${escapeHtml(input.meetingLink)}" style="color:${C.accent};text-decoration:none">${escapeHtml(input.meetingLink)}</a>
           </p>`
        : ""
    }

    <div style="margin:28px 0 0;padding:16px 18px;background:${C.softViolet};border-radius:12px">
      <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted}">
        📅 You'll also receive a <strong style="color:${C.ink}">Google Calendar invite</strong> for this meeting.
        Just reply to this email if anything needs to change.
      </p>
    </div>
  `;

  return shell(body, `Your ${input.meetingTypeName} is booked — Meet link inside.`);
}

function adminEmail(input: BookingEmailInput) {
  const { dateLabel, timeLabel } = formatWhen(
    input.date,
    input.startTime,
    input.durationMinutes,
  );

  const rows: [string, string][] = [
    ["Service", escapeHtml(input.meetingTypeName)],
    ["Date", dateLabel],
    ["Time", timeLabel],
    ["Email", `<a href="mailto:${escapeHtml(input.email)}" style="color:${C.accent};text-decoration:none">${escapeHtml(input.email)}</a>`],
  ];
  if (input.phone) rows.push(["Phone", escapeHtml(input.phone)]);
  if (input.company) rows.push(["Company", escapeHtml(input.company)]);

  const body = `
    ${pill("New booking")}
    <h1 style="margin:8px 0 6px;font-size:24px;line-height:1.3;color:${C.ink};font-weight:700">
      ${escapeHtml(input.name)} booked a ${escapeHtml(input.meetingTypeName)}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${C.muted}">
      A new meeting request just came in through your portfolio.
    </p>

    ${detailsCard(rows)}

    ${
      input.message
        ? `<div style="margin:20px 0 0;padding:16px 18px;background:#f8fafc;border:1px solid ${C.line};border-radius:12px">
             <p style="margin:0 0 6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${C.faint};font-weight:600">Message</p>
             <p style="margin:0;font-size:14px;line-height:1.6;color:${C.ink}">${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
           </div>`
        : ""
    }

    <div style="margin:28px 0 0">
      ${input.meetingLink ? buttonOutline("Join Google Meet", input.meetingLink) : ""}
      ${button("Open in dashboard", `${siteUrl}/admin/bookings`)}
    </div>
  `;

  return shell(body, `${input.name} booked a ${input.meetingTypeName}.`);
}

/* ------------------------------ pieces ------------------------------ */

function shell(content: string, preheader: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
  <span style="display:none;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Logo header -->
        <tr><td align="center" style="padding:8px 0 24px">
          <img src="${logoUrl}" width="56" height="56" alt="Abdulrahman Wardeh"
               style="display:block;border-radius:50%;width:56px;height:56px"/>
          <div style="margin-top:10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${C.faint};font-weight:600">
            Abdulrahman Wardeh
          </div>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:${C.card};border-radius:20px;padding:36px 36px 30px;box-shadow:0 1px 3px rgba(16,24,40,.06);font-family:'Helvetica Neue',Arial,sans-serif">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:24px 16px 8px;font-family:'Helvetica Neue',Arial,sans-serif">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            ${SOCIALS.map(
              (s) => `<td style="padding:0 6px">
                <a href="${s.url}" target="_blank" style="text-decoration:none">
                  <img src="https://img.icons8.com/fluency/48/${s.icon}.png" width="26" height="26" alt="${s.name}" style="display:block"/>
                </a></td>`,
            ).join("")}
          </tr></table>
          <p style="margin:14px 0 2px;font-size:13px;color:${C.muted}">
            <a href="${siteUrl}" style="color:${C.muted};text-decoration:none">Abdulrahman Wardeh</a> · UX/UI Designer
          </p>
          <p style="margin:0;font-size:11px;color:${C.faint}">
            You're receiving this because a meeting was booked on awardeh.me
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function pill(label: string) {
  return `<span style="display:inline-block;padding:5px 12px;background:${C.softViolet};color:${C.accentDark};font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:999px">${escapeHtml(label)}</span>`;
}

function detailsCard(rows: [string, string][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:14px;overflow:hidden">
    ${rows
      .map(
        ([k, v], i) => `<tr>
          <td style="padding:14px 18px;font-size:13px;color:${C.faint};font-weight:600;width:34%;${i ? `border-top:1px solid ${C.line}` : ""}">${escapeHtml(k)}</td>
          <td style="padding:14px 18px;font-size:14px;color:${C.ink};font-weight:600;text-align:right;${i ? `border-top:1px solid ${C.line}` : ""}">${v}</td>
        </tr>`,
      )
      .join("")}
  </table>`;
}

function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr>
    <td style="border-radius:12px;background:${C.accent}">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px">${escapeHtml(label)}</a>
    </td></tr></table>`;
}

function buttonOutline(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px"><tr>
    <td style="border-radius:12px;border:1.5px solid ${C.accent}">
      <a href="${href}" target="_blank" style="display:inline-block;padding:12px 26px;font-size:15px;font-weight:700;color:${C.accentDark};text-decoration:none;border-radius:12px">${escapeHtml(label)}</a>
    </td></tr></table>`;
}

/* ----------------------------- helpers ----------------------------- */

function formatWhen(date: string, startTime: string, durationMinutes: number) {
  try {
    const d = parse(date, "yyyy-MM-dd", new Date());
    const start = parse(startTime, "HH:mm", d);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return {
      dateLabel: format(d, "EEEE, MMMM d, yyyy"),
      timeLabel: `${format(start, "h:mm a")} – ${format(end, "h:mm a")} (${durationMinutes} min)`,
    };
  } catch {
    return {
      dateLabel: date,
      timeLabel: `${startTime} (${durationMinutes} min)`,
    };
  }
}

async function sendOne(
  label: string,
  payload: { from: string; to: string | string[]; subject: string; html: string },
) {
  if (!resend) return;
  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error(`[resend] ${label} email error:`, error);
    } else {
      console.log(`[resend] ${label} email sent → id ${data?.id}`);
    }
  } catch (e) {
    console.error(`[resend] ${label} email threw:`, e);
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
