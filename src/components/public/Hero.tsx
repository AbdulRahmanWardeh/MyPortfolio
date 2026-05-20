import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";
import { SocialButtonsRow } from "./SocialIcons";
import { HeroBackdrop } from "./HeroBackdrop";

export async function Hero({ locale }: { locale: Locale }) {
  const [hero, social, settings] = await Promise.all([
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    getSiteSettings(),
  ]);

  if (!hero) return null;

  return (
    <section className="relative isolate pt-12 md:pt-24">
      <HeroBackdrop />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <Reveal delay={0.06}>
          <h1 className="h-display text-balance text-[clamp(2.75rem,9vw,7rem)] font-semibold leading-[0.95] tracking-tight">
            <span className="block font-light text-white/55">
              {locale === "ar" ? "مرحباً، أنا" : "Hi, I'm"}
            </span>
            <span className="mt-2 block">{pickField(hero, locale, "name")}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-3 text-base font-medium tracking-wide text-white/55 md:text-lg">
            {pickField(hero, locale, "title")}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-pretty text-base text-white/70 md:text-xl">
            {pickField(hero, locale, "intro")}
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href={hero.primaryCtaHref}>
                {pickField(hero, locale, "primaryCtaLabel")}
                <DynamicIcon name={settings.ctaIcon} className="h-4 w-4 rtl:rotate-[-90deg]" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={hero.secondaryCtaHref}>
                {pickField(hero, locale, "secondaryCtaLabel")}
                <DynamicIcon name={settings.ctaIcon} className="h-4 w-4 rtl:rotate-[-90deg]" />
              </Link>
            </Button>
          </div>
        </Reveal>

        {social.length > 0 ? (
          <Reveal delay={0.36}>
            <SocialButtonsRow links={social} className="mt-12 justify-center" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
