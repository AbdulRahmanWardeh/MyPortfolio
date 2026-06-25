import { google } from "googleapis";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
];

export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  redirectUri:
    process.env.GOOGLE_OAUTH_REDIRECT_URI ??
    "http://localhost:3000/api/google/callback",
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN ?? "",
  calendarId: process.env.GOOGLE_CALENDAR_ID ?? "primary",
  timeZone: process.env.BOOKING_TIMEZONE ?? "Asia/Amman",
};

/** True once the one-time OAuth setup has produced a refresh token. */
export function isGoogleCalendarConfigured() {
  return Boolean(
    googleConfig.clientId &&
      googleConfig.clientSecret &&
      googleConfig.refreshToken,
  );
}

/** Whether OAuth client credentials exist (enough to run the consent flow). */
export function hasGoogleOAuthClient() {
  return Boolean(googleConfig.clientId && googleConfig.clientSecret);
}

export function createOAuthClient() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirectUri,
  );
}
