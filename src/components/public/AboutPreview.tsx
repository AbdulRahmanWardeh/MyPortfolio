import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal, Stagger, StaggerItem } from "./Motion";

export async function AboutPreview({ locale }: { locale: Locale }) {
  const about = await prisma.aboutContent.findUnique({ where: { id: "singleton" } });
  if (!about) return null;

  type Highlight = { titleEn: string; titleAr: string; descEn: string; descAr: string };
  const highlights = (about.highlights ?? []) as Highlight[];

  return (
    <section className="section">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/[0.08]">
            {about.profileImage ? (
              <Image
                src={about.profileImage}
                alt=""
                fill
                sizes="(min-width:1024px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
            )}
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.18em] text-white/40">
              {locale === "ar" ? "نبذة عني" : "About me"}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-display text-balance text-3xl font-semibold md:text-5xl">
              {pickField(about, locale, "headline")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-pretty text-base text-white/60 md:text-lg">
              {pickField(about, locale, "biography")}
            </p>
          </Reveal>

          {highlights.length > 0 ? (
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-3">
              {highlights.map((h, i) => (
                <StaggerItem key={i}>
                  <div className="surface h-full p-5">
                    <div className="text-sm font-medium">
                      {locale === "ar" ? h.titleAr : h.titleEn}
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      {locale === "ar" ? h.descAr : h.descEn}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          <Reveal delay={0.25}>
            <Link
              href="/about"
              className="mt-2 inline-flex items-center gap-2 text-sm text-white hover:opacity-80"
            >
              {locale === "ar" ? "اقرأ المزيد" : "Read more"}
              <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
