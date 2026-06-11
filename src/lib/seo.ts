import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { pickField, type Locale } from "@/lib/i18n-helpers";

export const getSiteSettings = cache(
  unstable_cache(
    async () =>
      prisma.siteSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
      }),
    ["site-settings"],
    { revalidate: 60, tags: ["settings"] },
  ),
);

export async function buildMetadata(opts: {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseTitle = settings.seoTitle;
  const baseDesc = settings.seoDesc;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${siteUrl}${opts.path ?? `/${opts.locale}`}`;

  const title = opts.title ? `${opts.title} · ${settings.siteName}` : baseTitle;
  const description = opts.description ?? baseDesc;
  const image = opts.image ?? settings.ogImage ?? undefined;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${opts.path?.replace(/^\/(en|ar)/, "") ?? ""}`,
        ar: `${siteUrl}/ar${opts.path?.replace(/^\/(en|ar)/, "") ?? ""}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.siteName,
      locale: opts.locale,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
