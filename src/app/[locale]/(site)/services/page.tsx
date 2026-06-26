import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getActiveServices } from "@/lib/content";
import type { Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/public/ServiceCard";
import { Reveal, Stagger, StaggerItem } from "@/components/public/Motion";
import { ContactCtaSection } from "@/components/public/ContactCtaSection";
import { getSiteSettings } from "@/lib/seo";

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
    path: `/${locale}/services`,
    title: t("services.title"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale });

  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="pt-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-12 md:px-24">
          <Reveal>
            <h1 className="h-display max-w-3xl text-balance text-4xl font-semibold md:text-6xl">
              {t("services.title")}
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-pretty text-base text-tint/60 md:text-lg">
              {t("services.subtitle")}
            </p>
          </Reveal>

          <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.id}>
                <ServiceCard
                  service={s}
                  locale={l}
                  ctaIcon={settings.ctaIcon}
                  labels={{
                    deliverables: t("services.deliverables"),
                    timeline: t("services.timeline"),
                  }}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Suspense fallback={<div className="section" />}>
        <ContactCtaSection locale={l} />
      </Suspense>
    </>
  );
}
