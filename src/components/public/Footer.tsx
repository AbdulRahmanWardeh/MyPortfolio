import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getFooterContent, getActiveSocialLinks } from "@/lib/content";
import { getSiteSettings } from "@/lib/seo";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { SocialButtonsRow } from "./SocialIcons";
import { FooterEmail } from "./FooterEmail";
import { Button } from "@/components/ui/button";
import { FooterCyclingWord } from "./FooterCyclingWord";

const menuLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms of service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [footer, social, settings] = await Promise.all([
    getFooterContent(),
    getActiveSocialLinks(),
    getSiteSettings(),
  ]);
  void t;

  return (
    <footer className="footer-theme relative overflow-hidden">
      {/* Accent line at top */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[2px] w-[60%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.6), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-12 md:px-24 pt-20 md:pt-28">
        {/* Headline */}
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.05] tracking-tight">
          <span className="text-tint">Let&apos;s <FooterCyclingWord /></span>
          <br />
          <span className="text-tint/35">
            {pickField(footer, locale, "bio")}
          </span>
        </h2>

        {/* Menu CTAs — left aligned, under headline */}
        <div className="mt-10 flex flex-wrap gap-2">
          {menuLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href as "/"}
              className="rounded-full border border-tint/[0.12] px-5 py-2 text-sm text-tint/55 transition hover:border-accent hover:bg-accent/10 hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Three-column contact info */}
        <div className="mt-8 grid gap-10 border-t border-tint/[0.08] pt-12 sm:grid-cols-3">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.15em] text-tint/35">Email</p>
            <FooterEmail email={footer.email} />
          </div>

          {/* Contact CTA */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.15em] text-tint/35">Work together</p>
            <Button asChild variant="accent" size="default" className="w-fit">
              <Link href="/contact">
                Book a meeting
              </Link>
            </Button>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.15em] text-tint/35">Social</p>
            <SocialButtonsRow
              links={social.slice(0, 6)}
              className="flex-wrap"
              buttonClassName="border-tint/[0.12] bg-tint/[0.04] text-tint/60 hover:border-tint/30 hover:bg-tint hover:text-[rgb(var(--footer-surface))]"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 border-t border-tint/[0.08]">
        <div className="mx-auto max-w-7xl px-12 md:px-24 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href as "/"}
                className="text-xs text-tint/40 transition hover:text-tint"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <span className="text-xs text-tint/30">
            {pickField(footer, locale, "copyright")}
          </span>
        </div>
      </div>
    </footer>
  );
}
