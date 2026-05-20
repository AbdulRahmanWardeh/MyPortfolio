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

  const meta: { label: string; value: string }[] = [
    { label: t("projects.category"), value: project.category },
    { label: t("projects.role"), value: pickField(project, l, "role") },
    { label: t("projects.timeline"), value: pickField(project, l, "timeline") },
    ...(project.client ? [{ label: t("projects.client"), value: project.client }] : []),
    { label: t("projects.type"), value: project.projectType },
  ];

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

        {project.coverImage ? (
          <Reveal delay={0.1}>
            <div className="relative mt-12 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/[0.10]">
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

        <Reveal delay={0.15}>
          <div className="surface mt-12 grid gap-6 p-8 md:grid-cols-3">
            <div className="md:col-span-2 whitespace-pre-line text-base text-white/70 md:text-lg">
              {pickField(project, l, "fullDesc")}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {meta.map((m) => (
                <div key={m.label}>
                  <div className="text-xs uppercase tracking-wide text-white/40">
                    {m.label}
                  </div>
                  <div className="mt-1 text-sm text-white/85">{m.value}</div>
                </div>
              ))}
              {project.tools.length > 0 ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/40">
                    {t("projects.tools")}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tools.map((pt) => (
                      <span
                        key={pt.toolId}
                        className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/70"
                      >
                        {pt.tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {externalLinks.length > 0 ? (
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/40">
                    {t("common.viewProject")}
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {externalLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-white hover:text-accent"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
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
