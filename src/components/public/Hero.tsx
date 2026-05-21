import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { getHeroContent, getActiveSocialLinks } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";
import { SocialButtonsRow } from "./SocialIcons";
import { HeroBackdrop } from "./HeroBackdrop";

export async function Hero({ locale }: { locale: Locale }) {
  const [hero, allSocial, settings] = await Promise.all([
    getHeroContent(),
    getActiveSocialLinks(),
    getSiteSettings(),
  ]);
  const social = allSocial.slice(0, 6);

  if (!hero) return null;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col justify-start pb-12 pt-16 md:pb-16 md:pt-24">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <Reveal delay={0.06}>
          <h1 className="h-display text-[clamp(2.75rem,9vw,7rem)] font-semibold leading-[0.9] tracking-tight">
            <span className="block font-light text-white">
              {locale === "ar" ? "مرحباً، أنا" : "Hello, I'm"}
            </span>
            <span className="block md:whitespace-nowrap">
              {pickField(hero, locale, "name")}
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <span className="mt-6 inline-block -rotate-3 rounded-none bg-accent px-6 py-2 font-display text-2xl font-bold uppercase tracking-wider text-accent-foreground shadow-[0_22px_50px_-18px_hsl(var(--accent)/0.6)] md:mt-10 md:px-8 md:py-3 md:text-4xl">
            UX Designer
          </span>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-12 max-w-2xl text-pretty text-base font-light text-white/70 md:mt-14 md:text-lg">
            {pickField(hero, locale, "intro")}
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
          <Reveal delay={0.3}>
            <SocialButtonsRow links={social} className="mt-12 justify-center" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
