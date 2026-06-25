import { NextResponse } from "next/server";
import { createOAuthClient, hasGoogleOAuthClient } from "@/lib/google";

/**
 * OAuth redirect target. Exchanges the authorization code for tokens and shows
 * the refresh token so it can be saved to .env. Local one-time setup only.
 */
export async function GET(req: Request) {
  if (!hasGoogleOAuthClient()) {
    return NextResponse.json(
      { error: "Missing Google OAuth client credentials." },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return NextResponse.json({ error: oauthError }, { status: 400 });
  }
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const oauth2 = createOAuthClient();
  let refreshToken: string | null | undefined;
  try {
    const { tokens } = await oauth2.getToken(code);
    refreshToken = tokens.refresh_token;
  } catch (e) {
    console.error("[google] token exchange failed", e);
    return NextResponse.json(
      { error: "Token exchange failed. Check server logs." },
      { status: 500 },
    );
  }

  if (!refreshToken) {
    return new NextResponse(
      htmlPage(
        "No refresh token returned",
        `Google didn't return a refresh token. This usually means you've already
         authorized this app before. Revoke access at
         <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>,
         then visit <a href="/api/google/connect">/api/google/connect</a> again.`,
      ),
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }

  // Also log to the server console as a fallback.
  console.log("[google] GOOGLE_REFRESH_TOKEN=" + refreshToken);

  return new NextResponse(
    htmlPage(
      "✅ Google Calendar connected",
      `Copy this into your <code>.env</code> as <code>GOOGLE_REFRESH_TOKEN</code>,
       then restart the dev server:
       <pre style="white-space:pre-wrap;word-break:break-all;background:#111;color:#0f0;padding:16px;border-radius:8px">${escapeHtml(
         refreshToken,
       )}</pre>
       You can close this tab afterward.`,
    ),
    { status: 200, headers: { "Content-Type": "text/html" } },
  );
}

function htmlPage(title: string, body: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head>
  <body style="font-family:ui-sans-serif,system-ui;max-width:640px;margin:48px auto;padding:0 16px;line-height:1.6">
    <h1>${title}</h1><p>${body}</p>
  </body></html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
