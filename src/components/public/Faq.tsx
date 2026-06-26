import { getTranslations } from "next-intl/server";
import { getActiveFaqs } from "@/lib/content";
import { type Locale } from "@/lib/i18n-helpers";
import { SectionHeader } from "./SectionHeader";
import { FaqAccordion } from "./FaqAccordion";

export async function Faq({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const faqs = await getActiveFaqs();
  if (faqs.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-12 md:px-24">
        <SectionHeader
          align="center"
          kicker={t("home.faqKicker")}
          title={t("home.faqTitle")}
        />
        <div className="mt-14">
          <FaqAccordion items={faqs} locale={locale} />
        </div>
      </div>
    </section>
  );
}
