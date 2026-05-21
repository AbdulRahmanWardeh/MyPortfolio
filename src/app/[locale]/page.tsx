import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/public/Hero";
import { AboutPreview } from "@/components/public/AboutPreview";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { Testimonials } from "@/components/public/Testimonials";
import { Tools } from "@/components/public/Tools";
import { ContactCtaSection } from "@/components/public/ContactCtaSection";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n-helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildMetadata({ locale: locale as Locale, path: `/${locale}` });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  return (
    <>
      <Hero locale={l} />
      <AboutPreview locale={l} />
      <FeaturedProjects locale={l} />
      <ExperienceTimeline locale={l} />
      <Testimonials locale={l} />
      <Tools locale={l} />
      <ContactCtaSection locale={l} />
    </>
  );
}
