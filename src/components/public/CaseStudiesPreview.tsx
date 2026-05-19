import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Stagger, StaggerItem } from "./Motion";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function CaseStudiesPreview({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const studies = await prisma.caseStudy.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    take: 3,
  });
  if (studies.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker={t("home.caseStudiesKicker")}
          title={t("home.caseStudies")}
        />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((cs) => (
            <StaggerItem key={cs.id}>
              <Link
                href={`/case-studies/${cs.slug}`}
                className="surface group flex h-full flex-col overflow-hidden transition hover:bg-white/[0.04]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {cs.coverImage ? (
                    <Image
                      src={cs.coverImage}
                      alt={pickField(cs, locale, "title")}
                      fill
                      sizes="(min-width:1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <h3 className="text-lg font-medium leading-tight">
                    {pickField(cs, locale, "title")}
                  </h3>
                  <p className="line-clamp-3 text-sm text-white/55">
                    {pickField(cs, locale, "summary")}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-sm text-white/80">
                    {t("common.readCaseStudy")}
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
