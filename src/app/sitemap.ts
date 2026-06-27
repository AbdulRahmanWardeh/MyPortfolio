import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const locales = ["en", "ar"] as const;
  const staticPaths = ["", "/about", "/projects", "/services", "/contact"];

  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const items: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      items.push({
        url: `${base}/${locale}${p}`,
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const proj of projects) {
      items.push({
        url: `${base}/${locale}/projects/${proj.slug}`,
        lastModified: proj.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return items;
}
