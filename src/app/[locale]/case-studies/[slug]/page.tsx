import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft02Icon as ArrowLeft } from "hugeicons-react";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/public/Motion";
import { CaseStudyRenderer } from "@/components/public/CaseStudyRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!cs) return {};
  return buildMetadata({
    locale: locale as Locale,
    path: `/${locale}/case-studies/${slug}`,
    title: pickField(cs, locale as Locale, "title"),
    description: pickField(cs, locale as Locale, "summary"),
    image: cs.coverImage ?? undefined,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale });

  const cs = await prisma.caseStudy.findUnique({
    where: { slug },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!cs || !cs.isPublished) notFound();

  return (
    <article className="pb-32 pt-24 md:pt-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {t("caseStudy.backToCaseStudies")}
        </Link>

        <Reveal>
          <span className="mt-6 inline-block text-xs uppercase tracking-[0.18em] text-white/40">
            {t("home.caseStudies")}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="h-display mt-3 text-balance text-4xl font-semibold md:text-6xl">
            {pickField(cs, l, "title")}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-3xl text-pretty text-base text-white/65 md:text-lg">
            {pickField(cs, l, "summary")}
          </p>
        </Reveal>

        {cs.coverImage ? (
          <Reveal delay={0.15}>
            <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.10]">
              <Image
                src={cs.coverImage}
                alt={pickField(cs, l, "title")}
                fill
                sizes="(min-width:1024px) 80vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        {(cs.client || cs.roleEn || cs.timelineEn) && (
          <Reveal delay={0.2}>
            <div className="surface mt-12 grid grid-cols-2 gap-6 p-6 md:grid-cols-3">
              {cs.client ? (
                <Meta label={t("projects.client")} value={cs.client} />
              ) : null}
              <Meta label={t("projects.role")} value={pickField(cs, l, "role")} />
              <Meta
                label={t("projects.timeline")}
                value={pickField(cs, l, "timeline")}
              />
            </div>
          </Reveal>
        )}

        <div className="mt-20">
          <CaseStudyRenderer sections={cs.sections} locale={l} />
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className="mt-1 text-sm text-white/85">{value}</div>
    </div>
  );
}
