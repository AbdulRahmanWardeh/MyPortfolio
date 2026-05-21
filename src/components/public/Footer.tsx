import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import {
  getFooterContent,
  getActiveSocialLinks,
} from "@/lib/content";
import { getSiteSettings } from "@/lib/seo";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { SocialButtonsRow } from "./SocialIcons";
import { Mail01Icon as Mail } from "hugeicons-react";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

export async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [footer, social, settings] = await Promise.all([
    getFooterContent(),
    getActiveSocialLinks(),
    getSiteSettings(),
  ]);

  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6">
      <footer className="overflow-hidden rounded-3xl border border-white/[0.10] bg-white/[0.04] backdrop-blur-md">
        <div className="grid gap-12 px-8 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-12 md:py-16">
          <div>
            <div className="h-display text-2xl font-semibold tracking-tight">
              {settings.siteName}
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/55">
              {pickField(footer, locale, "bio")}
            </p>
            <a
              href={`mailto:${footer.email}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.03] px-4 py-2 text-sm text-white/85 transition hover:bg-white hover:text-black"
            >
              <Mail className="h-3.5 w-3.5" />
              {footer.email}
            </a>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40">
              {t("footer.navigation")}
            </h4>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-white/75">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {t(`nav.${l.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/40">
              {t("footer.social")}
            </h4>
            <SocialButtonsRow links={social} className="mt-5" />
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-8 py-5 text-xs text-white/40 md:px-12">
            <span>
              {pickField(footer, locale, "copyright")} {new Date().getFullYear()}
            </span>
            <span>{settings.siteName}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
