import { getTools } from "@/lib/content";
import { type Locale } from "@/lib/i18n-helpers";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";
import { ToolsMarquee } from "./ToolsMarquee";

export async function Tools({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const tools = await getTools();
  if (tools.length === 0) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          kicker={t("home.tools")}
          title="The tools in my daily kit"
        />
      </div>
      <div className="mx-auto mt-14 w-full max-w-7xl px-6">
        <ToolsMarquee items={tools} />
      </div>
    </section>
  );
}
