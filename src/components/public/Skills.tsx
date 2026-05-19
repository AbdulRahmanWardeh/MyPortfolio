import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Stagger, StaggerItem } from "./Motion";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function Skills({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  if (skills.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker={t("home.skills")}
          title={
            locale === "ar"
              ? "أساس عملي يعتمد على هذه المهارات"
              : "The foundations my work is built on"
          }
        />
        <Stagger className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s) => (
            <StaggerItem key={s.id}>
              <div className="surface group flex h-full flex-col gap-4 p-6 transition hover:bg-white/[0.04]">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-medium">{pickField(s, locale, "name")}</div>
                  <div className="text-xs text-white/40">{s.level}%</div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent/40 transition-[width] duration-700 group-hover:from-accent group-hover:to-accent"
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="text-xs uppercase tracking-wide text-white/40">
                  {s.category}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
