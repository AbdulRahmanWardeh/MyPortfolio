import { setRequestLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n-helpers";
import { buildMetadata } from "@/lib/seo";
import { BookingFlow } from "@/components/public/BookingFlow";
import { getAvailableDaysOfWeek, getBlockedDates } from "@/lib/booking";
import { Reveal } from "@/components/public/Motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return buildMetadata({
    locale: locale as Locale,
    path: `/${locale}/contact`,
    title: t("contact.title"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const t = await getTranslations({ locale });

  const now = new Date();
  const inOneYear = new Date();
  inOneYear.setFullYear(now.getFullYear() + 1);

  const [meetingTypes, availableDays, blocked] = await Promise.all([
    prisma.meetingType.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    getAvailableDaysOfWeek(),
    getBlockedDates(now, inOneYear),
  ]);

  return (
    <section className="pb-32 pt-24 md:pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h1 className="h-display text-balance text-4xl font-semibold md:text-6xl">
              {t("contact.title")}
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-pretty text-base text-white/60 md:text-lg">
              {t("contact.subtitle")}
            </p>
          </Reveal>
        </div>

        <div className="mt-16">
          <BookingFlow
            locale={l}
            meetingTypes={meetingTypes}
            availableDaysOfWeek={availableDays}
            blockedDates={blocked}
          />
        </div>
      </div>
    </section>
  );
}
