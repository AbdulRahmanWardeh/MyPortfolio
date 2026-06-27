import { Link } from "@/i18n/routing";
import { DynamicIcon } from "@/lib/hugeicon";
import { getSiteSettings } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { getContactCta } from "@/lib/content";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";

export async function ContactCtaSection({ locale }: { locale: Locale }) {
  const [cta, settings] = await Promise.all([
    getContactCta(),
    getSiteSettings(),
  ]);

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-12 md:px-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-tint/[0.10] bg-white px-8 py-14 md:px-16 md:py-20 dark:bg-[#08070c]">
            {/* Brand outline mark, bleeding off the side opposite the text */}
            <svg
              aria-hidden
              className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[110%] w-auto translate-x-[15%] translate-y-[18%] text-accent opacity-25"
              viewBox="0 0 1089 1106"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M1088 469.75V654.5C1088 811.458 960.895 938.728 804 938.998V773H273.5V1105C122.68 1104.73 0.500244 982.383 0.500244 831.5V277H273.5V499.5H804V499C804 375.841 704.16 276 581 276H274.5V0.5H618.75C877.91 0.5 1088 210.59 1088 469.75Z"
                stroke="currentColor"
                strokeWidth={2.5}
              />
            </svg>

            {/* Soft purple bloom rising from the bottom — base wash + blurred core */}
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(80% 70% at 50% 108%, hsl(var(--accent)/0.22), transparent 62%)",
              }}
            />
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-56 w-[80%] -translate-x-1/2 translate-y-1/2 rounded-[50%]"
              style={{
                background: "hsl(var(--accent))",
                opacity: 0.28,
                filter: "blur(90px)",
              }}
            />

            {/* Texture */}
            <div className="pointer-events-none absolute inset-0 -z-10 noise opacity-15" />

            <div className="relative max-w-3xl">
              <h2 className="h-display text-balance text-3xl font-semibold md:text-5xl">
                {pickField(cta, locale, "headline")}
              </h2>
              <p className="mt-4 text-pretty text-base text-tint/70 md:text-lg">
                {pickField(cta, locale, "subtitle")}
              </p>
              <div className="mt-8">
                <Button asChild variant="accent" size="lg">
                  <Link href={cta.ctaHref}>
                    {pickField(cta, locale, "ctaLabel")}
                    <DynamicIcon name={settings.ctaIcon} className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
