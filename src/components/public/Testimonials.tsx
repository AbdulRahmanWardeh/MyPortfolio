import { getTestimonials } from "@/lib/content";
import { type Locale } from "@/lib/i18n-helpers";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

export async function Testimonials({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const list = await getTestimonials();
  if (list.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-12 md:px-24">
        <SectionHeader
          kicker={t("home.testimonials")}
          title="What people I've worked with say"
        />
        <div className="mt-10 md:mt-12">
          <TestimonialsCarousel items={list} locale={locale} />
        </div>
      </div>
    </section>
  );
}
