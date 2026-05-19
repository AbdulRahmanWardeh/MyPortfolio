import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { type Locale } from "@/lib/i18n-helpers";
import { Stagger, StaggerItem } from "./Motion";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const projects = await prisma.project.findMany({
    where: { isFeatured: true, isPublished: true },
    orderBy: { order: "asc" },
    take: 6,
  });
  if (projects.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            kicker={t("home.featuredProjectsKicker")}
            title={t("home.featuredProjects")}
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
          >
            {t("home.viewAllProjects")}
            <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
          </Link>
        </div>

        <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.id}>
              <ProjectCard project={p} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
