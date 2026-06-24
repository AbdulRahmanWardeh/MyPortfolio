import { getExperiences } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { formatMonthYear } from "@/lib/utils";
import { Stagger, StaggerItem } from "./Motion";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function ExperienceTimeline({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const experiences = await getExperiences();
  if (experiences.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          kicker={t("home.experience")}
          title="Selected experience"
        />
        <Stagger className="mt-14">
          <ol className="relative ms-3 border-s border-white/[0.08]">
            {experiences.map((e) => (
              <li key={e.id} className="ps-8 pb-12 last:pb-0">
                <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white/20 bg-accent" />
                <StaggerItem>
                  <div className="surface p-6">
                    <div className="text-xs uppercase tracking-wide text-white/40">
                      {formatMonthYear(e.startDate, locale)} —{" "}
                      {e.isCurrent
                        ? t("common.present")
                        : formatMonthYear(e.endDate, locale)}
                    </div>
                    <h3 className="mt-2 text-lg font-medium">
                      {pickField(e, locale, "role")}{" "}
                      <span className="text-white/50">· {e.company}</span>
                    </h3>
                    {pickField(e, locale, "location") ? (
                      <div className="mt-1 text-sm text-white/40">
                        {pickField(e, locale, "location")}
                      </div>
                    ) : null}
                    {pickField(e, locale, "description") ? (
                      <p className="mt-3 text-sm text-white/65">
                        {pickField(e, locale, "description")}
                      </p>
                    ) : null}
                  </div>
                </StaggerItem>
              </li>
            ))}
          </ol>
        </Stagger>
      </div>
    </section>
  );
}
