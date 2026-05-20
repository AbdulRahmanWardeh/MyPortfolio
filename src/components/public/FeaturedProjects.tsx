import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { type Locale } from "@/lib/i18n-helpers";
import { Stagger, StaggerItem } from "./Motion";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [projects, settings] = await Promise.all([
    prisma.project.findMany({
      where: { isFeatured: true, isPublished: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    getSiteSettings(),
  ]);
  if (projects.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            kicker={t("home.featuredProjectsKicker")}
            title={t("home.featuredProjects")}
          />
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">
              {t("home.viewAllProjects")}
              <DynamicIcon
                name={settings.ctaIcon}
                className="h-3.5 w-3.5 rtl:rotate-[-90deg]"
              />
            </Link>
          </Button>
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
