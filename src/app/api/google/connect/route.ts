import { NextResponse } from "next/server";
import {
  createOAuthClient,
  hasGoogleOAuthClient,
  GOOGLE_SCOPES,
} from "@/lib/google";

/**
 * One-time setup helper: visit /api/google/connect to grant the app access to
 * your Google Calendar. Google redirects back to /api/google/callback, which
 * prints a refresh token to paste into .env (GOOGLE_REFRESH_TOKEN).
 */
export async function GET() {
  if (!hasGoogleOAuthClient()) {
    return NextResponse.json(
      {
        error:
          "Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET. Add them to .env first.",
      },
      { status: 400 },
    );
  }

  const oauth2 = createOAuthClient();
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // force a refresh_token even on re-auth
    scope: GOOGLE_SCOPES,
  });

  return NextResponse.redirect(url);
}
