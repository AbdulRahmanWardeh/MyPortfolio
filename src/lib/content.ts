import { cache } from "react";
import { prisma } from "@/lib/db";

/**
 * React-cached accessors for the singleton content rows. Each one upserts on
 * first read so the row always exists, and React.cache dedupes calls within
 * a single request — even if 5 components ask for HeroContent, Prisma only
 * runs the query once per request.
 */

export const getHeroContent = cache(async () => {
  return prisma.heroContent.findUnique({ where: { id: "singleton" } });
});

export const getAboutContent = cache(async () => {
  return prisma.aboutContent.findUnique({ where: { id: "singleton" } });
});

export const getContactCta = cache(async () => {
  return prisma.contactCta.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
});

export const getFooterContent = cache(async () => {
  return prisma.footerContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
});

export const getActiveSocialLinks = cache(async () => {
  return prisma.socialLink.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
});
