import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";

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
    prisma.footerContent.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
    prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    }),
  ]);

  return (
    <footer className="border-t border-white/[0.06] bg-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-sm font-medium">{settings.siteName}</div>
          <p className="mt-3 max-w-sm text-sm text-white/50">
            {pickField(footer, locale, "bio")}
          </p>
          <a
            href={`mailto:${footer.email}`}
            className="mt-6 inline-block text-sm text-white/80 underline-offset-4 hover:underline"
          >
            {footer.email}
          </a>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wide text-white/40">
            {t("footer.navigation")}
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {t(`nav.${l.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wide text-white/40">
            {t("footer.social")}
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            {social.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  {s.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-white/40">
          <span>
            {pickField(footer, locale, "copyright")} {new Date().getFullYear()}
          </span>
          <span>{settings.siteName}</span>
        </div>
      </div>
    </footer>
  );
}
