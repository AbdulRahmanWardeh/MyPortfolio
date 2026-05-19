"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { CaseStudySectionType, BookingStatus } from "@prisma/client";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  const s = str(v).trim();
  return s.length ? s : null;
}
function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true";
}
function int(v: FormDataEntryValue | null, def = 0): number {
  const n = parseInt(str(v), 10);
  return Number.isFinite(n) ? n : def;
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- Singletons ----------

export async function updateHero(fd: FormData) {
  await requireAdmin();
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    update: {
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      introEn: str(fd.get("introEn")),
      introAr: str(fd.get("introAr")),
      primaryCtaLabelEn: str(fd.get("primaryCtaLabelEn")),
      primaryCtaLabelAr: str(fd.get("primaryCtaLabelAr")),
      primaryCtaHref: str(fd.get("primaryCtaHref")) || "/projects",
      secondaryCtaLabelEn: str(fd.get("secondaryCtaLabelEn")),
      secondaryCtaLabelAr: str(fd.get("secondaryCtaLabelAr")),
      secondaryCtaHref: str(fd.get("secondaryCtaHref")) || "/contact",
      profileImage: strOrNull(fd.get("profileImage")),
    },
    create: {
      id: "singleton",
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      introEn: str(fd.get("introEn")),
      introAr: str(fd.get("introAr")),
    },
  });
  revalidateAll();
}

export async function updateAbout(fd: FormData) {
  await requireAdmin();
  const highlightsRaw = str(fd.get("highlights"));
  let highlights: unknown = [];
  try {
    highlights = highlightsRaw ? JSON.parse(highlightsRaw) : [];
  } catch {
    highlights = [];
  }
  await prisma.aboutContent.upsert({
    where: { id: "singleton" },
    update: {
      headlineEn: str(fd.get("headlineEn")),
      headlineAr: str(fd.get("headlineAr")),
      biographyEn: str(fd.get("biographyEn")),
      biographyAr: str(fd.get("biographyAr")),
      philosophyEn: str(fd.get("philosophyEn")),
      philosophyAr: str(fd.get("philosophyAr")),
      experienceSummaryEn: str(fd.get("experienceSummaryEn")),
      experienceSummaryAr: str(fd.get("experienceSummaryAr")),
      profileImage: strOrNull(fd.get("profileImage")),
      highlights: highlights as never,
    },
    create: {
      id: "singleton",
      headlineEn: str(fd.get("headlineEn")),
      headlineAr: str(fd.get("headlineAr")),
      biographyEn: str(fd.get("biographyEn")),
      biographyAr: str(fd.get("biographyAr")),
      philosophyEn: str(fd.get("philosophyEn")),
      philosophyAr: str(fd.get("philosophyAr")),
      experienceSummaryEn: str(fd.get("experienceSummaryEn")),
      experienceSummaryAr: str(fd.get("experienceSummaryAr")),
    },
  });
  revalidateAll();
}

export async function updateContactCta(fd: FormData) {
  await requireAdmin();
  await prisma.contactCta.upsert({
    where: { id: "singleton" },
    update: {
      headlineEn: str(fd.get("headlineEn")),
      headlineAr: str(fd.get("headlineAr")),
      subtitleEn: str(fd.get("subtitleEn")),
      subtitleAr: str(fd.get("subtitleAr")),
      ctaLabelEn: str(fd.get("ctaLabelEn")),
      ctaLabelAr: str(fd.get("ctaLabelAr")),
      ctaHref: str(fd.get("ctaHref")) || "/contact",
    },
    create: { id: "singleton" },
  });
  revalidateAll();
}

export async function updateFooter(fd: FormData) {
  await requireAdmin();
  await prisma.footerContent.upsert({
    where: { id: "singleton" },
    update: {
      bioEn: str(fd.get("bioEn")),
      bioAr: str(fd.get("bioAr")),
      email: str(fd.get("email")),
      copyrightEn: str(fd.get("copyrightEn")),
      copyrightAr: str(fd.get("copyrightAr")),
    },
    create: { id: "singleton" },
  });
  revalidateAll();
}

export async function updateSettings(fd: FormData) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteName: str(fd.get("siteName")),
      primaryColor: str(fd.get("primaryColor")) || "#0a0a0a",
      accentColor: str(fd.get("accentColor")) || "#8b5cf6",
      defaultLocale: str(fd.get("defaultLocale")) || "en",
      ogImage: strOrNull(fd.get("ogImage")),
    },
    create: { id: "singleton" },
  });
  revalidateAll();
}

export async function updateSeo(fd: FormData) {
  await requireAdmin();
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      seoTitleEn: str(fd.get("seoTitleEn")),
      seoTitleAr: str(fd.get("seoTitleAr")),
      seoDescEn: str(fd.get("seoDescEn")),
      seoDescAr: str(fd.get("seoDescAr")),
      ogImage: strOrNull(fd.get("ogImage")),
    },
    create: { id: "singleton" },
  });
  revalidateAll();
}

// ---------- Skills ----------

export async function createSkill(fd: FormData) {
  await requireAdmin();
  await prisma.skill.create({
    data: {
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      category: str(fd.get("category")) || "Design",
      level: int(fd.get("level"), 80),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function updateSkill(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.skill.update({
    where: { id },
    data: {
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      category: str(fd.get("category")) || "Design",
      level: int(fd.get("level"), 80),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidateAll();
}

// ---------- Tools ----------

export async function createTool(fd: FormData) {
  await requireAdmin();
  await prisma.tool.create({
    data: {
      name: str(fd.get("name")),
      category: str(fd.get("category")) || "Design",
      iconUrl: strOrNull(fd.get("iconUrl")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function updateTool(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.tool.update({
    where: { id },
    data: {
      name: str(fd.get("name")),
      category: str(fd.get("category")) || "Design",
      iconUrl: strOrNull(fd.get("iconUrl")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function deleteTool(id: string) {
  await requireAdmin();
  await prisma.tool.delete({ where: { id } });
  revalidateAll();
}

// ---------- Social Links ----------

export async function createSocial(fd: FormData) {
  await requireAdmin();
  await prisma.socialLink.create({
    data: {
      platform: str(fd.get("platform")),
      url: str(fd.get("url")),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateSocial(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.socialLink.update({
    where: { id },
    data: {
      platform: str(fd.get("platform")),
      url: str(fd.get("url")),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteSocial(id: string) {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidateAll();
}

// ---------- Experience ----------

export async function createExperience(fd: FormData) {
  await requireAdmin();
  await prisma.experience.create({
    data: {
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      company: str(fd.get("company")),
      locationEn: str(fd.get("locationEn")),
      locationAr: str(fd.get("locationAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      startDate: new Date(str(fd.get("startDate"))),
      endDate: strOrNull(fd.get("endDate"))
        ? new Date(str(fd.get("endDate")))
        : null,
      isCurrent: bool(fd.get("isCurrent")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateExperience(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.experience.update({
    where: { id },
    data: {
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      company: str(fd.get("company")),
      locationEn: str(fd.get("locationEn")),
      locationAr: str(fd.get("locationAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      startDate: new Date(str(fd.get("startDate"))),
      endDate: strOrNull(fd.get("endDate"))
        ? new Date(str(fd.get("endDate")))
        : null,
      isCurrent: bool(fd.get("isCurrent")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidateAll();
}

// ---------- Testimonials ----------

export async function createTestimonial(fd: FormData) {
  await requireAdmin();
  await prisma.testimonial.create({
    data: {
      author: str(fd.get("author")),
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      company: str(fd.get("company")),
      avatarUrl: strOrNull(fd.get("avatarUrl")),
      quoteEn: str(fd.get("quoteEn")),
      quoteAr: str(fd.get("quoteAr")),
      rating: int(fd.get("rating"), 5),
      isFeatured: bool(fd.get("isFeatured")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateTestimonial(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.testimonial.update({
    where: { id },
    data: {
      author: str(fd.get("author")),
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      company: str(fd.get("company")),
      avatarUrl: strOrNull(fd.get("avatarUrl")),
      quoteEn: str(fd.get("quoteEn")),
      quoteAr: str(fd.get("quoteAr")),
      rating: int(fd.get("rating"), 5),
      isFeatured: bool(fd.get("isFeatured")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidateAll();
}

// ---------- Services ----------

export async function createService(fd: FormData) {
  await requireAdmin();
  const deliverablesRaw = str(fd.get("deliverables"));
  let deliverables: unknown = [];
  try {
    deliverables = deliverablesRaw ? JSON.parse(deliverablesRaw) : [];
  } catch {
    deliverables = [];
  }
  await prisma.service.create({
    data: {
      icon: str(fd.get("icon")) || "Sparkles",
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      deliverables: deliverables as never,
      timelineEn: str(fd.get("timelineEn")),
      timelineAr: str(fd.get("timelineAr")),
      ctaLabelEn: str(fd.get("ctaLabelEn")) || "Book a meeting",
      ctaLabelAr: str(fd.get("ctaLabelAr")) || "احجز اجتماعاً",
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateService(id: string, fd: FormData) {
  await requireAdmin();
  const deliverablesRaw = str(fd.get("deliverables"));
  let deliverables: unknown = [];
  try {
    deliverables = deliverablesRaw ? JSON.parse(deliverablesRaw) : [];
  } catch {
    deliverables = [];
  }
  await prisma.service.update({
    where: { id },
    data: {
      icon: str(fd.get("icon")) || "Sparkles",
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      deliverables: deliverables as never,
      timelineEn: str(fd.get("timelineEn")),
      timelineAr: str(fd.get("timelineAr")),
      ctaLabelEn: str(fd.get("ctaLabelEn")) || "Book a meeting",
      ctaLabelAr: str(fd.get("ctaLabelAr")) || "احجز اجتماعاً",
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteService(id: string) {
  await requireAdmin();
  await prisma.service.delete({ where: { id } });
  revalidateAll();
}

// ---------- Projects ----------

export async function createProject(fd: FormData) {
  await requireAdmin();
  const galleryRaw = str(fd.get("gallery"));
  let gallery: Array<{ url: string; altEn?: string; altAr?: string }> = [];
  try {
    gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
  } catch {
    gallery = [];
  }
  const toolIds = fd.getAll("toolIds").map(String);
  const slug = slugify(str(fd.get("slug")) || str(fd.get("titleEn")));

  await prisma.project.create({
    data: {
      slug,
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      shortDescEn: str(fd.get("shortDescEn")),
      shortDescAr: str(fd.get("shortDescAr")),
      fullDescEn: str(fd.get("fullDescEn")),
      fullDescAr: str(fd.get("fullDescAr")),
      coverImage: strOrNull(fd.get("coverImage")),
      category: str(fd.get("category")) || "UX/UI",
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      timelineEn: str(fd.get("timelineEn")),
      timelineAr: str(fd.get("timelineAr")),
      client: strOrNull(fd.get("client")),
      projectType: str(fd.get("projectType")) || "Case Study",
      liveLink: strOrNull(fd.get("liveLink")),
      behanceLink: strOrNull(fd.get("behanceLink")),
      dribbbleLink: strOrNull(fd.get("dribbbleLink")),
      figmaLink: strOrNull(fd.get("figmaLink")),
      isFeatured: bool(fd.get("isFeatured")),
      isPublished: bool(fd.get("isPublished")),
      order: int(fd.get("order")),
      images: {
        create: gallery.map((g, i) => ({
          url: g.url,
          altEn: g.altEn ?? "",
          altAr: g.altAr ?? "",
          order: i,
        })),
      },
      tools: {
        create: toolIds.map((tid) => ({ tool: { connect: { id: tid } } })),
      },
    },
  });
  revalidateAll();
}

export async function updateProject(id: string, fd: FormData) {
  await requireAdmin();
  const galleryRaw = str(fd.get("gallery"));
  let gallery: Array<{ url: string; altEn?: string; altAr?: string }> = [];
  try {
    gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
  } catch {
    gallery = [];
  }
  const toolIds = fd.getAll("toolIds").map(String);
  const slug = slugify(str(fd.get("slug")));

  await prisma.$transaction([
    prisma.projectImage.deleteMany({ where: { projectId: id } }),
    prisma.projectTool.deleteMany({ where: { projectId: id } }),
    prisma.project.update({
      where: { id },
      data: {
        slug,
        titleEn: str(fd.get("titleEn")),
        titleAr: str(fd.get("titleAr")),
        shortDescEn: str(fd.get("shortDescEn")),
        shortDescAr: str(fd.get("shortDescAr")),
        fullDescEn: str(fd.get("fullDescEn")),
        fullDescAr: str(fd.get("fullDescAr")),
        coverImage: strOrNull(fd.get("coverImage")),
        category: str(fd.get("category")) || "UX/UI",
        roleEn: str(fd.get("roleEn")),
        roleAr: str(fd.get("roleAr")),
        timelineEn: str(fd.get("timelineEn")),
        timelineAr: str(fd.get("timelineAr")),
        client: strOrNull(fd.get("client")),
        projectType: str(fd.get("projectType")) || "Case Study",
        liveLink: strOrNull(fd.get("liveLink")),
        behanceLink: strOrNull(fd.get("behanceLink")),
        dribbbleLink: strOrNull(fd.get("dribbbleLink")),
        figmaLink: strOrNull(fd.get("figmaLink")),
        isFeatured: bool(fd.get("isFeatured")),
        isPublished: bool(fd.get("isPublished")),
        order: int(fd.get("order")),
        images: {
          create: gallery.map((g, i) => ({
            url: g.url,
            altEn: g.altEn ?? "",
            altAr: g.altAr ?? "",
            order: i,
          })),
        },
        tools: {
          create: toolIds.map((tid) => ({ tool: { connect: { id: tid } } })),
        },
      },
    }),
  ]);
  revalidateAll();
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidateAll();
}

// ---------- Case Studies ----------

export async function createCaseStudy(fd: FormData) {
  await requireAdmin();
  const slug = slugify(str(fd.get("slug")) || str(fd.get("titleEn")));
  await prisma.caseStudy.create({
    data: {
      slug,
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      summaryEn: str(fd.get("summaryEn")),
      summaryAr: str(fd.get("summaryAr")),
      coverImage: strOrNull(fd.get("coverImage")),
      client: strOrNull(fd.get("client")),
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      timelineEn: str(fd.get("timelineEn")),
      timelineAr: str(fd.get("timelineAr")),
      isPublished: bool(fd.get("isPublished")),
      isFeatured: bool(fd.get("isFeatured")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function updateCaseStudy(id: string, fd: FormData) {
  await requireAdmin();
  const slug = slugify(str(fd.get("slug")));
  await prisma.caseStudy.update({
    where: { id },
    data: {
      slug,
      titleEn: str(fd.get("titleEn")),
      titleAr: str(fd.get("titleAr")),
      summaryEn: str(fd.get("summaryEn")),
      summaryAr: str(fd.get("summaryAr")),
      coverImage: strOrNull(fd.get("coverImage")),
      client: strOrNull(fd.get("client")),
      roleEn: str(fd.get("roleEn")),
      roleAr: str(fd.get("roleAr")),
      timelineEn: str(fd.get("timelineEn")),
      timelineAr: str(fd.get("timelineAr")),
      isPublished: bool(fd.get("isPublished")),
      isFeatured: bool(fd.get("isFeatured")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin();
  await prisma.caseStudy.delete({ where: { id } });
  revalidateAll();
}

export async function upsertCaseStudySection(input: {
  id?: string;
  caseStudyId: string;
  type: CaseStudySectionType;
  order: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  blocks: unknown[];
}) {
  await requireAdmin();
  if (input.id) {
    await prisma.caseStudySection.update({
      where: { id: input.id },
      data: {
        type: input.type,
        order: input.order,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        bodyEn: input.bodyEn,
        bodyAr: input.bodyAr,
        blocks: input.blocks as never,
      },
    });
  } else {
    await prisma.caseStudySection.create({
      data: {
        caseStudyId: input.caseStudyId,
        type: input.type,
        order: input.order,
        titleEn: input.titleEn,
        titleAr: input.titleAr,
        bodyEn: input.bodyEn,
        bodyAr: input.bodyAr,
        blocks: input.blocks as never,
      },
    });
  }
  revalidateAll();
}

export async function deleteCaseStudySection(id: string) {
  await requireAdmin();
  await prisma.caseStudySection.delete({ where: { id } });
  revalidateAll();
}

export async function reorderCaseStudySections(orders: Array<{ id: string; order: number }>) {
  await requireAdmin();
  await prisma.$transaction(
    orders.map((o) =>
      prisma.caseStudySection.update({
        where: { id: o.id },
        data: { order: o.order },
      }),
    ),
  );
  revalidateAll();
}

// ---------- Meeting Types ----------

export async function createMeetingType(fd: FormData) {
  await requireAdmin();
  const slug = slugify(str(fd.get("slug")) || str(fd.get("nameEn")));
  await prisma.meetingType.create({
    data: {
      slug,
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      durationMinutes: int(fd.get("durationMinutes"), 30),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateMeetingType(id: string, fd: FormData) {
  await requireAdmin();
  const slug = slugify(str(fd.get("slug")));
  await prisma.meetingType.update({
    where: { id },
    data: {
      slug,
      nameEn: str(fd.get("nameEn")),
      nameAr: str(fd.get("nameAr")),
      descriptionEn: str(fd.get("descriptionEn")),
      descriptionAr: str(fd.get("descriptionAr")),
      durationMinutes: int(fd.get("durationMinutes"), 30),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteMeetingType(id: string) {
  await requireAdmin();
  await prisma.meetingType.delete({ where: { id } });
  revalidateAll();
}

// ---------- Availability ----------

export async function createAvailabilityRule(fd: FormData) {
  await requireAdmin();
  await prisma.availabilityRule.create({
    data: {
      dayOfWeek: int(fd.get("dayOfWeek")),
      startTime: str(fd.get("startTime")) || "09:00",
      endTime: str(fd.get("endTime")) || "17:00",
      isActive: bool(fd.get("isActive")),
    },
  });
  revalidateAll();
}
export async function updateAvailabilityRule(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.availabilityRule.update({
    where: { id },
    data: {
      dayOfWeek: int(fd.get("dayOfWeek")),
      startTime: str(fd.get("startTime")) || "09:00",
      endTime: str(fd.get("endTime")) || "17:00",
      isActive: bool(fd.get("isActive")),
    },
  });
  revalidateAll();
}
export async function deleteAvailabilityRule(id: string) {
  await requireAdmin();
  await prisma.availabilityRule.delete({ where: { id } });
  revalidateAll();
}

export async function addBlockedDate(fd: FormData) {
  await requireAdmin();
  const dateStr = str(fd.get("date"));
  if (!dateStr) return;
  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);
  await prisma.blockedDate.upsert({
    where: { date },
    update: { reason: strOrNull(fd.get("reason")) },
    create: { date, reason: strOrNull(fd.get("reason")) },
  });
  revalidateAll();
}

export async function deleteBlockedDate(id: string) {
  await requireAdmin();
  await prisma.blockedDate.delete({ where: { id } });
  revalidateAll();
}

// ---------- Bookings ----------

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await requireAdmin();
  await prisma.booking.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function deleteBooking(id: string) {
  await requireAdmin();
  await prisma.booking.delete({ where: { id } });
  revalidateAll();
}
