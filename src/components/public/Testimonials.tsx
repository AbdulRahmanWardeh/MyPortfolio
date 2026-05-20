import { prisma } from "@/lib/db";
import { type Locale } from "@/lib/i18n-helpers";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

export async function Testimonials({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const list = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  if (list.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker={t("home.testimonials")}
          title={
            locale === "ar"
              ? "ما يقوله الأشخاص الذين عملت معهم"
              : "What people I've worked with say"
          }
        />
        <div className="mt-14">
          <TestimonialsCarousel items={list} locale={locale} />
        </div>
      </div>
    </section>
  );
}
