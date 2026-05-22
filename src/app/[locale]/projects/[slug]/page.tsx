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
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { Reveal, Stagger, StaggerItem } from "@/components/public/Motion";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
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
    prisma.project.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        tools: { include: { tool: true } },
      },
    }),
    getSiteSettings(),
  ]);
  if (!project || !project.isPublished) notFound();

  const more = await prisma.project.findMany({
    where: { isPublished: true, NOT: { id: project.id } },
    orderBy: { order: "asc" },
    take: 3,
  });

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
    ...(project.tools.length > 0
      ? [
          {
            label: t("projects.tools"),
            value: project.tools.map((pt) => pt.tool.name).join(" · "),
          },
        ]
      : []),
  ].filter((s) => s.value && s.value.trim().length > 0);

  const externalLinks = [
    { url: project.liveLink, label: t("projects.liveLink") },
    { url: project.behanceLink, label: "Behance" },
    { url: project.dribbbleLink, label: "Dribbble" },
    { url: project.figmaLink, label: "Figma" },
  ].filter((l): l is { url: string; label: string } => Boolean(l.url));

  return (
    <article className="pb-32 pt-24 md:pt-32">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {t("projects.backToProjects")}
        </Link>

        <Reveal>
          <h1 className="h-display mt-6 text-balance text-4xl font-semibold md:text-6xl">
            {pickField(project, l, "title")}
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 max-w-3xl text-pretty text-base text-white/65 md:text-lg">
            {pickField(project, l, "shortDesc")}
          </p>
        </Reveal>

        {/* Horizontal stats card — dynamic, dividers between cells */}
        {stats.length > 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.10] bg-white/[0.04]">
              <div className="flex flex-wrap items-stretch divide-x divide-white/[0.08] sm:flex-nowrap rtl:divide-x-reverse">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex min-w-[160px] flex-1 flex-col justify-center gap-1.5 px-6 py-5 text-start"
                  >
                    <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/40">
                      {s.label}
                    </div>
                    <div className="text-base font-semibold text-white">
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
            <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.10]">
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
          <div className="surface mt-12 p-8">
            <div className="whitespace-pre-line text-base text-white/70 md:text-lg">
              {pickField(project, l, "fullDesc")}
            </div>
            {externalLinks.length > 0 ? (
              <div className="mt-8 border-t border-white/[0.06] pt-6">
                <div className="text-xs uppercase tracking-wide text-white/40">
                  {t("common.viewProject")}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {externalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.03] px-3.5 py-1.5 text-sm text-white/85 transition hover:border-white/30 hover:bg-white hover:text-black"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>

        {project.images.length > 0 ? (
          <div className="mt-16">
            <h2 className="h-display text-2xl font-semibold md:text-3xl">
              {t("projects.gallery")}
            </h2>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-2">
              {project.images.map((img) => (
                <StaggerItem key={img.id}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.06]">
                    <Image
                      src={img.url}
                      alt={pickField(img, l, "alt")}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ) : null}

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
                    className="h-3.5 w-3.5 rtl:rotate-[-90deg]"
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
