import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";

export async function Hero({ locale }: { locale: Locale }) {
  const [hero, social] = await Promise.all([
    prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 5,
    }),
  ]);

  if (!hero) return null;

  return (
    <section className="relative isolate overflow-hidden pt-32 md:pt-44">
      <div className="absolute inset-0 -z-10 bg-radial-glow opacity-90" />
      <div className="absolute inset-0 -z-10 noise opacity-50" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-8">
            <Reveal>
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {locale === "ar" ? "متاح لمشاريع مختارة" : "Available for select work"}
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="h-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                {pickField(hero, locale, "name")}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="max-w-xl text-lg text-white/70 md:text-xl">
                <span className="text-white/90">{pickField(hero, locale, "title")}.</span>{" "}
                {pickField(hero, locale, "intro")}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="flex flex-wrap items-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href={hero.primaryCtaHref}>
                  {pickField(hero, locale, "primaryCtaLabel")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={hero.secondaryCtaHref}>
                  {pickField(hero, locale, "secondaryCtaLabel")}
                  <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                </Link>
              </Button>
            </Reveal>

            {social.length > 0 ? (
              <Reveal delay={0.28} className="flex flex-wrap items-center gap-4 pt-2">
                <span className="text-xs uppercase tracking-wide text-white/40">
                  {locale === "ar" ? "تواصل" : "Connect"}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {social.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={0.1} className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-white/[0.08]">
              {hero.profileImage ? (
                <Image
                  src={hero.profileImage}
                  alt={pickField(hero, locale, "name")}
                  fill
                  sizes="(min-width:1024px) 480px, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div className="absolute -end-4 -top-4 -z-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
