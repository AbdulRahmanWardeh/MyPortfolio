import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getFooterContent,
  getActiveSocialLinks,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/seo";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { SocialButtonsRow } from "./SocialIcons";
import { ArrowUpRight02Icon } from "hugeicons-react";
import { FooterEmail } from "./FooterEmail";

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [footer, social, settings] = await Promise.all([
    getFooterContent(),
    getActiveSocialLinks(),
    getSiteSettings(),
  ]);
  void t;

  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6">
      <footer className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-white/[0.04] backdrop-blur-md">
        {/* Soft purple glow at top-center */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[60vw] -translate-x-1/2 rounded-full blur-[80px]"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--accent) / 0.22), transparent 70%)",
          }}
        />

        {/* Statement headline */}
        <div className="relative px-6 pt-16 md:px-12 md:pt-24">
          <h2 className="h-display text-center font-bold uppercase leading-[0.85] tracking-tight">
            <span
              className="block text-[clamp(2.5rem,11vw,9.5rem)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.30) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Let&apos;s work together
            </span>
          </h2>
        </div>

        {/* CTA + intro */}
        <div className="relative mx-auto mt-12 flex max-w-4xl flex-col items-center gap-10 px-6 pb-16 md:flex-row md:items-center md:gap-12 md:px-12 md:pb-20">
          <Link
            href="/contact"
            className="group relative grid h-44 w-44 shrink-0 place-items-center rounded-full bg-accent text-center font-display text-base font-semibold text-accent-foreground shadow-[0_30px_80px_-20px_hsl(var(--accent)/0.7)] transition-transform duration-300 hover:scale-105 md:h-48 md:w-48"
          >
            <span className="inline-flex items-center gap-2">
              Say Hello
              <ArrowUpRight02Icon className="h-4 w-4" />
            </span>
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-0 ring-2 ring-accent/60 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>

          <div className="flex max-w-md flex-col items-center gap-5 text-center md:items-start md:text-start">
            <p className="text-pretty text-base text-white/65 md:text-lg">
              {pickField(footer, locale, "bio")}
            </p>
            <FooterEmail email={footer.email} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-accent transition hover:border-white/30 hover:bg-white hover:text-black"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {settings.siteName}
            </Link>

            <SocialButtonsRow
              links={social.slice(0, 5)}
              className="order-last w-full justify-center md:order-none md:w-auto"
            />

            <span className="text-xs text-white/50">
              {pickField(footer, locale, "copyright")} {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
