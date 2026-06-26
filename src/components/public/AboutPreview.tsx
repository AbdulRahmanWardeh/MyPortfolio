import Image from "next/image";
import { Link } from "@/i18n/routing";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { getAboutContent } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { parseJson } from "@/lib/utils";
import { Download } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./Motion";
import { Eyebrow } from "./Eyebrow";
import { Button } from "@/components/ui/button";

export async function AboutPreview({ locale }: { locale: Locale }) {
  const [about, settings] = await Promise.all([
    getAboutContent(),
    getSiteSettings(),
  ]);
  if (!about) return null;

  type Highlight = { titleEn: string; descEn: string };
  const highlights = parseJson<Highlight[]>(about.highlights, []);

  return (
    <section className="section">
      <div className="mx-auto grid max-w-7xl gap-12 px-12 md:px-24 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
        <Reveal className="relative lg:h-full">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-tint/[0.10] lg:aspect-auto lg:h-full lg:min-h-[500px]">
            {about.profileImage ? (
              <Image
                src={about.profileImage}
                alt=""
                fill
                priority
                sizes="(min-width:1024px) 480px, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-tint/[0.05] to-transparent" />
            )}
          </div>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal>
            <Eyebrow>About me</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="h-display text-balance text-3xl font-semibold md:text-5xl">
              {pickField(about, locale, "headline")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-pretty text-base text-tint/60 md:text-lg">
              {pickField(about, locale, "biography")}
            </p>
          </Reveal>

          {highlights.length > 0 ? (
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-3">
              {highlights.map((h, i) => (
                <StaggerItem key={i}>
                  <div className="surface h-full rounded-xl p-5">
                    <div className="text-sm font-medium">{h.titleEn}</div>
                    <p className="mt-2 text-xs text-tint/50">{h.descEn}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          <Reveal delay={0.25}>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button asChild variant="accent" size="default" className="w-fit h-12">
                <a
                  href={about.resumeUrl ?? "/resume.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  Download Resume
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="default" className="w-fit h-12">
                <Link href="/about">
                  Read more
                  <DynamicIcon name={settings.ctaIcon} className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
