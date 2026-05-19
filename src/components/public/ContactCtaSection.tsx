import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";
import { Reveal } from "./Motion";

export async function ContactCtaSection({ locale }: { locale: Locale }) {
  const cta = await prisma.contactCta.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-gradient-to-br from-accent/30 via-white/[0.02] to-transparent px-8 py-16 md:px-16 md:py-24">
            <div className="absolute inset-0 -z-10 noise opacity-30" />
            <div className="max-w-3xl">
              <h2 className="h-display text-balance text-3xl font-semibold md:text-5xl">
                {pickField(cta, locale, "headline")}
              </h2>
              <p className="mt-4 text-pretty text-base text-white/65 md:text-lg">
                {pickField(cta, locale, "subtitle")}
              </p>
              <div className="mt-8">
                <Button asChild variant="default" size="lg">
                  <Link href={cta.ctaHref}>
                    {pickField(cta, locale, "ctaLabel")}
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
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
