import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { getFeaturedProjects } from "@/lib/content";
import { type Locale } from "@/lib/i18n-helpers";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const [projects, settings] = await Promise.all([
    getFeaturedProjects(),
    getSiteSettings(),
  ]);
  if (projects.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-12 md:px-24">
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
                className="h-3.5 w-3.5"
              />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
            <ProjectCard key={p.id} project={p} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
