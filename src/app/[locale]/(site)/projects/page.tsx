import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedProjects } from "@/lib/content";
import type { Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { ProjectFilters } from "@/components/public/ProjectFilters";
import { Reveal } from "@/components/public/Motion";

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
    path: `/${locale}/projects`,
    title: t("projects.title"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const projects = await getPublishedProjects();

  return (
    <section className="pt-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h1 className="h-display max-w-3xl text-balance text-4xl font-semibold md:text-6xl">
            {t("projects.title")}
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-4 max-w-2xl text-pretty text-base text-white/60 md:text-lg">
            {t("projects.subtitle")}
          </p>
        </Reveal>

        <div className="mt-16 pb-24">
          <ProjectFilters projects={projects} locale={locale as Locale} />
        </div>
      </div>
    </section>
  );
}
