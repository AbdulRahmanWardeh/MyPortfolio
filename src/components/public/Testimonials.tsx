import Image from "next/image";
import { Quote } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Stagger, StaggerItem } from "./Motion";
import { SectionHeader } from "./SectionHeader";
import { getTranslations } from "next-intl/server";

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
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((tm) => (
            <StaggerItem key={tm.id}>
              <figure className="surface flex h-full flex-col gap-5 p-7">
                <Quote className="h-5 w-5 text-accent" />
                <blockquote className="text-pretty text-base text-white/85">
                  &ldquo;{pickField(tm, locale, "quote")}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  {tm.avatarUrl ? (
                    <Image
                      src={tm.avatarUrl}
                      alt={tm.author}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-white/[0.08]" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{tm.author}</div>
                    <div className="text-xs text-white/50">
                      {pickField(tm, locale, "role")} · {tm.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
