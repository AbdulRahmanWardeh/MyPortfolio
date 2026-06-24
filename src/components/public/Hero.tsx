import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { getHeroContent, getActiveSocialLinks } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";
import { SocialButtonsRow } from "./SocialIcons";
import { HeroBackdrop } from "./HeroBackdrop";
import { getTranslations } from "next-intl/server";

export async function Hero({ locale }: { locale: Locale }) {
  const [hero, allSocial, settings, t] = await Promise.all([
    getHeroContent(),
    getActiveSocialLinks(),
    getSiteSettings(),
    getTranslations({ locale }),
  ]);
  const social = allSocial.slice(0, 6);

  if (!hero) return null;

  const stats = [
    { value: hero.yearsExperience, label: t("home.yearsExperience") },
    { value: hero.projectsBuilt, label: t("home.projectsBuilt") },
    { value: hero.clientsServed, label: t("home.clientsServed") },
  ].filter((s) => s.value > 0);

  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col justify-start pb-12 pt-16 md:pb-16 md:pt-24">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <Reveal delay={0.06}>
          <h1 className="h-display text-[clamp(3.5rem,11vw,7rem)] font-semibold leading-[0.9] tracking-tight">
            <span className="block font-light text-white">
              Hello, I&apos;m
            </span>
            <span className="block md:whitespace-nowrap">
              {pickField(hero, locale, "name")}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <span className="mt-5 inline-block -rotate-3 rounded-none bg-accent px-7 py-2.5 font-display text-3xl font-bold uppercase tracking-wider text-accent-foreground shadow-[0_22px_50px_-18px_hsl(var(--accent)/0.6)] md:mt-8 md:px-8 md:py-3 md:text-4xl">
            UX Designer
          </span>
        </Reveal>

        {stats.length > 0 ? (
          <Reveal delay={0.18} className="mt-10 w-full md:mt-12">
            <dl className="mx-auto grid w-full max-w-3xl grid-cols-3 divide-x divide-white/[0.08] sm:gap-4 sm:divide-x-0">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center gap-2 px-3 py-4 sm:rounded-xl sm:border sm:border-white/[0.10] sm:bg-white/[0.04] sm:px-5 sm:py-6 md:py-7"
                >
                  <dt className="h-display text-2xl font-bold leading-none text-white sm:text-3xl md:text-5xl">
                    {s.value}
                    <span className="text-accent">+</span>
                  </dt>
                  <dd className="text-center text-[0.6rem] uppercase tracking-[0.15em] text-white/55 sm:text-[0.7rem] md:text-xs">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14">
            <Button asChild variant="accent" size="lg">
              <Link href={hero.primaryCtaHref}>
                {pickField(hero, locale, "primaryCtaLabel")}
                <DynamicIcon name={settings.ctaIcon} className="h-4 w-4 " />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={hero.secondaryCtaHref}>
                {pickField(hero, locale, "secondaryCtaLabel")}
                <DynamicIcon name={settings.ctaIcon} className="h-4 w-4 " />
              </Link>
            </Button>
          </div>
        </Reveal>

        {social.length > 0 ? (
          <Reveal delay={0.32}>
            <SocialButtonsRow links={social} className="mt-10 justify-center md:mt-12" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
