import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

const REVALIDATE = 60;

export const getHeroContent = cache(
  unstable_cache(
    async () => prisma.heroContent.findUnique({ where: { id: "singleton" } }),
    ["hero-content"],
    { revalidate: REVALIDATE, tags: ["content", "hero"] },
  ),
);

export const getAboutContent = cache(
  unstable_cache(
    async () => prisma.aboutContent.findUnique({ where: { id: "singleton" } }),
    ["about-content"],
    { revalidate: REVALIDATE, tags: ["content", "about"] },
  ),
);

export const getContactCta = cache(
  unstable_cache(
    async () =>
      prisma.contactCta.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
      }),
    ["contact-cta"],
    { revalidate: REVALIDATE, tags: ["content", "cta"] },
  ),
);

export const getFooterContent = cache(
  unstable_cache(
    async () =>
      prisma.footerContent.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
      }),
    ["footer-content"],
    { revalidate: REVALIDATE, tags: ["content", "footer"] },
  ),
);

export const getActiveSocialLinks = cache(
  unstable_cache(
    async () =>
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ["social-links"],
    { revalidate: REVALIDATE, tags: ["content", "social"] },
  ),
);

export const getFeaturedProjects = cache(
  unstable_cache(
    async () =>
      prisma.project.findMany({
        where: { isFeatured: true, isPublished: true },
        orderBy: { order: "asc" },
        take: 8,
      }),
    ["featured-projects"],
    { revalidate: REVALIDATE, tags: ["content", "projects"] },
  ),
);

export const getExperiences = cache(
  unstable_cache(
    async () => prisma.experience.findMany({ orderBy: { order: "asc" } }),
    ["experiences"],
    { revalidate: REVALIDATE, tags: ["content", "experiences"] },
  ),
);

export const getTestimonials = cache(
  unstable_cache(
    async () => prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    ["testimonials"],
    { revalidate: REVALIDATE, tags: ["content", "testimonials"] },
  ),
);

export const getPublishedProjects = cache(
  unstable_cache(
    async () =>
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      }),
    ["published-projects"],
    { revalidate: REVALIDATE, tags: ["content", "projects"] },
  ),
);

/**
 * Slugs of published projects — used by generateStaticParams so
 * the most common project routes pre-render at build time.
 */
export const getPublishedProjectSlugs = cache(
  unstable_cache(
    async () => {
      const rows = await prisma.project.findMany({
        where: { isPublished: true },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    },
    ["published-project-slugs"],
    { revalidate: REVALIDATE, tags: ["content", "projects"] },
  ),
);

/**
 * Single project lookup with images and tools eagerly included.
 * Cached per-slug; admin edits hit revalidatePath("/", "layout").
 */
export const getProjectBySlug = cache((slug: string) =>
  unstable_cache(
    async () =>
      prisma.project.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { order: "asc" } },
        },
      }),
    ["project-by-slug", slug],
    { revalidate: REVALIDATE, tags: ["content", "projects", `project:${slug}`] },
  )(),
);

/**
 * "More projects" rail at the bottom of a slug page. Cached per
 * excluded id so we get a stable list across renders.
 */
export const getMoreProjects = cache((excludeId: string, take = 3) =>
  unstable_cache(
    async () =>
      prisma.project.findMany({
        where: { isPublished: true, NOT: { id: excludeId } },
        orderBy: { order: "asc" },
        take,
      }),
    ["more-projects", excludeId, String(take)],
    { revalidate: REVALIDATE, tags: ["content", "projects"] },
  )(),
);

export const getActiveFaqs = cache(
  unstable_cache(
    async () =>
      prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ["active-faqs"],
    { revalidate: REVALIDATE, tags: ["content", "faqs"] },
  ),
);

export const getActiveServices = cache(
  unstable_cache(
    async () =>
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ["active-services"],
    { revalidate: REVALIDATE, tags: ["content", "services"] },
  ),
);

export const getActiveMeetingTypes = cache(
  unstable_cache(
    async () =>
      prisma.meetingType.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ["meeting-types"],
    { revalidate: 30, tags: ["content", "meeting-types"] },
  ),
);
