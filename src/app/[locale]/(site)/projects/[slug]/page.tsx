import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft02Icon as ArrowLeft,
  LinkSquare02Icon as ExternalLink,
} from "hugeicons-react";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import {
  getProjectBySlug,
  getMoreProjects,
  getPublishedProjectSlugs,
} from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { Reveal } from "@/components/public/Motion";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectSections } from "@/components/public/ProjectSections";
import { ShareProject } from "@/components/public/ShareProject";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    locale: locale as Locale,
    path: `/${locale}/projects/${slug}`,
    title: pickField(project, locale as Locale, "title"),
    description: pickField(project, locale as Locale, "shortDesc"),
    image: project.coverImage ?? undefined,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale });

  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);
  if (!project || !project.isPublished) notFound();

  const more = await getMoreProjects(project.id);

  // Stats shown in the horizontal card directly under the heading.
  // Each entry only appears when there's actually a value, so the card
  // is fully dynamic — admin can clear a field to remove its pill.
  const stats: { label: string; value: string }[] = [
    { label: t("projects.category"), value: project.category },
    { label: t("projects.role"), value: pickField(project, l, "role") },
    { label: t("projects.timeline"), value: pickField(project, l, "timeline") },
    { label: t("projects.type"), value: project.projectType },
    ...(project.client
      ? [{ label: t("projects.client"), value: project.client }]
      : []),
  ].filter((s) => s.value && s.value.trim().length > 0);

  // Canonical share target. `localePrefix` is "never", so public project URLs
  // carry no locale segment — share exactly what the address bar shows.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `${siteUrl}/projects/${slug}`;

  const externalLinks = [
    { url: project.liveLink, label: t("projects.liveLink") },
    { url: project.behanceLink, label: "Behance" },
    { url: project.dribbbleLink, label: "Dribbble" },
    { url: project.figmaLink, label: "Figma" },
  ].filter((l): l is { url: string; label: string } => Boolean(l.url));

  return (
    <article className="pb-32 pt-6 md:pt-12">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-tint/60 hover:text-tint"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("projects.backToProjects")}
        </Link>

        <Reveal>
          <h1 className="h-display mt-6 text-balance text-4xl font-semibold md:text-6xl">
            {pickField(project, l, "title")}
          </h1>
        </Reveal>
        {/* Horizontal stats card — dynamic, dividers between cells */}
        {stats.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-tint/[0.10] bg-tint/[0.04]">
              <div className="flex flex-wrap items-stretch divide-x divide-tint/[0.08] sm:flex-nowrap">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex min-w-[160px] flex-1 flex-col justify-center gap-1.5 px-6 py-5 text-start"
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.15em] text-tint/40">
                      {s.label}
                    </div>
                    <div className="text-base font-semibold text-tint">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {project.coverImage ? (
          <Reveal delay={0.15}>
            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-tint/[0.10]">
              <Image
                src={project.coverImage}
                alt={pickField(project, l, "title")}
                fill
                sizes="(min-width:1024px) 80vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.2}>
          <div className="surface surface-soft mt-12 p-8">
            <div className="whitespace-pre-line text-base text-tint/70 md:text-lg">
              {pickField(project, l, "fullDesc")}
            </div>
            {externalLinks.length > 0 ? (
              <div className="mt-8 border-t border-tint/[0.06] pt-6">
                <div className="text-xs uppercase tracking-wide text-tint/40">
                  {t("common.viewProject")}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {externalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-tint/[0.10] bg-tint/[0.03] px-3.5 py-1.5 text-sm text-tint/85 transition hover:border-tint/30 hover:bg-tint hover:text-background"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 border-t border-tint/[0.06] pt-6">
              <ShareProject
                url={shareUrl}
                title={pickField(project, l, "title")}
              />
            </div>
          </div>
        </Reveal>

        {project.sections.length > 0 ? (
          <div className="mt-20">
            <ProjectSections sections={project.sections} locale={l} />
          </div>
        ) : null}

        {/* No project-level gallery — imagery lives in the section blocks, so
            each photo sits next to the story it belongs to. */}

        {more.length > 0 ? (
          <div className="mt-24">
            <div className="flex items-baseline justify-between">
              <h2 className="h-display text-2xl font-semibold md:text-3xl">
                {t("projects.moreProjects")}
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link href="/projects">
                  {t("common.viewAll")}
                  <DynamicIcon
                    name={settings.ctaIcon}
                    className="h-3.5 w-3.5"
                  />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <ProjectCard key={p.id} project={p} locale={l} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
