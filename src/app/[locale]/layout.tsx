import * as React from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/toaster";
import { getSiteSettings } from "@/lib/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Root locale layout — providers only. Visual chrome (Navbar/Footer/
 * particles) lives in (site)/layout.tsx so admin and login routes
 * don't inherit it.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);

  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  // `--background` is the admin-customizable dark surface, so it must NOT leak
  // into light mode — scope it to `:not(.light)` so the `.light` theme token in
  // globals.css wins when the light theme is active. Accent/ring are brand
  // colors shared by both themes, so they stay on plain `:root`.
  const themeCss = `:root:not(.light){--background:${hexToHsl(settings.primaryColor)};}:root{--accent:${hexToHsl(settings.accentColor)};--ring:${hexToHsl(settings.accentColor)};}`;

  return (
    <div lang="en" dir="ltr" className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
        <Toaster />
      </NextIntlClientProvider>
    </div>
  );
}

function hexToHsl(hex: string): string {
  const m = hex.replace("#", "");
  const bigint = parseInt(
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m,
    16,
  );
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
