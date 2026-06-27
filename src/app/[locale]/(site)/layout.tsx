import * as React from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FallingParticles } from "@/components/public/FallingParticles";
import { ScrollToTop } from "@/components/public/ScrollToTop";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { type Locale } from "@/lib/i18n-helpers";

export const revalidate = 60;

/**
 * Public-site layout — the visible chrome (Navbar/Footer/particles)
 * lives here so it never renders for /admin or /login.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <>
      <FallingParticles />
      <Navbar
        siteName={settings.siteName}
        ctaIcon={
          <DynamicIcon name={settings.ctaIcon} className="h-3.5 w-3.5" />
        }
      />
      <main className="relative z-[1] pt-24 md:pt-28">{children}</main>
      <Footer locale={locale as Locale} />
      <ScrollToTop />
    </>
  );
}
