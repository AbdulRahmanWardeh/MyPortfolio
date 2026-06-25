import Image from "next/image";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAboutContent } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { Reveal, Stagger, StaggerItem } from "@/components/public/Motion";
import { Eyebrow } from "@/components/public/Eyebrow";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildMetadata({
    locale: locale as Locale,
    path: `/${locale}/about`,
    title: t("about.title"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale });

  const about = await getAboutContent();
  if (!about) return null;

  type Highlight = {
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
  };
  const { parseJson } = await import("@/lib/utils");
  const highlights = parseJson<Highlight[]>(about.highlights, []);

  return (
    <>
      <section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <Eyebrow>{t("about.title")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="h-display mt-4 max-w-3xl text-balance text-4xl font-semibold md:text-6xl">
              {pickField(about, l, "headline")}
            </h1>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/[0.10]">
                {about.profileImage ? (
                  <Image
                    src={about.profileImage}
                    alt=""
                    fill
                    sizes="(min-width:1024px) 480px, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                )}
              </div>
            </Reveal>

            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-xs uppercase tracking-[0.18em] text-white/40">
                  {t("about.biography")}
                </h2>
                <Reveal delay={0.05}>
                  <p className="mt-3 text-pretty text-base text-white/70 md:text-lg whitespace-pre-line">
                    {pickField(about, l, "biography")}
                  </p>
                </Reveal>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-[0.18em] text-white/40">
                  {t("about.philosophy")}
                </h2>
                <Reveal delay={0.05}>
                  <p className="mt-3 text-pretty text-base text-white/70 md:text-lg whitespace-pre-line">
                    {pickField(about, l, "philosophy")}
                  </p>
                </Reveal>
              </div>

              <div>
                <h2 className="text-xs uppercase tracking-[0.18em] text-white/40">
                  {t("about.experience")}
                </h2>
                <Reveal delay={0.05}>
                  <p className="mt-3 text-pretty text-base text-white/70 md:text-lg whitespace-pre-line">
                    {pickField(about, l, "experienceSummary")}
                  </p>
                </Reveal>
              </div>

              {highlights.length > 0 ? (
                <Stagger className="grid gap-4 sm:grid-cols-3">
                  {highlights.map((h, i) => (
                    <StaggerItem key={i}>
                      <div className="surface h-full rounded-xl p-6">
                        <div className="text-sm font-medium">{h.titleEn}</div>
                        <p className="mt-2 text-sm text-white/55">{h.descEn}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : null}

              {about.resumeUrl ? (
                <Reveal delay={0.1}>
                  <Button asChild variant="accent" size="lg" className="w-fit">
                    <a
                      href={about.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {t("about.downloadResume")}
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="section" />}>
        <ExperienceTimeline locale={l} />
      </Suspense>
    </>
  );
}
