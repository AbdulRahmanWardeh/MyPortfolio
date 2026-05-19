import Image from "next/image";
import { prisma } from "@/lib/db";
import { type Locale } from "@/lib/i18n-helpers";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

export async function Tools({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const tools = await prisma.tool.findMany({ orderBy: { order: "asc" } });
  if (tools.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker={t("home.tools")}
          title={
            locale === "ar"
              ? "الأدوات التي أستخدمها يومياً"
              : "The tools in my daily kit"
          }
        />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="surface flex items-center gap-3 px-4 py-4 text-sm transition hover:bg-white/[0.04]"
            >
              {tool.iconUrl ? (
                <Image
                  src={tool.iconUrl}
                  alt={tool.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded"
                />
              ) : (
                <div className="grid h-7 w-7 place-items-center rounded bg-white/[0.06] text-[0.7rem] font-medium text-white/80">
                  {tool.name.slice(0, 1)}
                </div>
              )}
              <span className="truncate">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
