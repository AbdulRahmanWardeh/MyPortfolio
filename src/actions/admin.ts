"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ProjectSectionType, BookingStatus } from "@/lib/enums";

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
  // The public data layer (lib/content.ts, lib/seo.ts) wraps every query in
  // unstable_cache, whose entries are keyed by their *tags* — not by route.
  // revalidatePath only clears the rendered-route cache, so without these tag
  // purges an admin edit would keep serving the stale cached value until the
  // 60s revalidate timer lapsed. Purge the data-cache tags so saves show up
  // immediately. ("content" covers all content.ts queries; "settings" covers
  // getSiteSettings used by SEO/branding.)
  revalidateTag("content");
  revalidateTag("settings");
  revalidatePath("/", "layout");
}

// ---------- Singletons ----------

export async function updateHero(fd: FormData) {
  await requireAdmin();
  await prisma.heroContent.upsert({
    where: { id: "singleton" },
    update: {
      nameEn: str(fd.get("nameEn")),
      titleEn: str(fd.get("titleEn")),
      introEn: str(fd.get("introEn")),
      primaryCtaLabel: str(fd.get("primaryCtaLabel")) || "View Projects",
      primaryCtaHref: str(fd.get("primaryCtaHref")) || "/projects",
      secondaryCtaLabel: str(fd.get("secondaryCtaLabel")) || "Book a Meeting",
      secondaryCtaHref: str(fd.get("secondaryCtaHref")) || "/contact",
      profileImage: strOrNull(fd.get("profileImage")),
      yearsExperience: int(fd.get("yearsExperience")),
      projectsBuilt: int(fd.get("projectsBuilt")),
      clientsServed: int(fd.get("clientsServed")),
    },
    create: {
      id: "singleton",
      nameEn: str(fd.get("nameEn")),
      titleEn: str(fd.get("titleEn")),
      introEn: str(fd.get("introEn")),
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
      biographyEn: str(fd.get("biographyEn")),
      philosophyEn: str(fd.get("philosophyEn")),
      experienceSummaryEn: str(fd.get("experienceSummaryEn")),
      profileImage: strOrNull(fd.get("profileImage")),
      resumeUrl: str(fd.get("resumeUrl")),
      highlights: JSON.stringify(highlights),
    },
    create: {
      id: "singleton",
      headlineEn: str(fd.get("headlineEn")),
      biographyEn: str(fd.get("biographyEn")),
      philosophyEn: str(fd.get("philosophyEn")),
      experienceSummaryEn: str(fd.get("experienceSummaryEn")),
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
      subtitleEn: str(fd.get("subtitleEn")),
      ctaLabelEn: str(fd.get("ctaLabelEn")),
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
      email: str(fd.get("email")),
      copyrightEn: str(fd.get("copyrightEn")),
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
      ogImage: strOrNull(fd.get("ogImage")),
      ctaIcon: str(fd.get("ctaIcon")),
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
      seoTitle: str(fd.get("seoTitle")),
      seoDesc: str(fd.get("seoDesc")),
      ogImage: strOrNull(fd.get("ogImage")),
    },
    create: { id: "singleton" },
  });
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

// ---------- FAQ ----------

export async function createFaq(fd: FormData) {
  await requireAdmin();
  await prisma.faq.create({
    data: {
      questionEn: str(fd.get("questionEn")),
      answerEn: str(fd.get("answerEn")),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function updateFaq(id: string, fd: FormData) {
  await requireAdmin();
  await prisma.faq.update({
    where: { id },
    data: {
      questionEn: str(fd.get("questionEn")),
      answerEn: str(fd.get("answerEn")),
      isActive: bool(fd.get("isActive")),
      order: int(fd.get("order")),
    },
  });
  revalidateAll();
}
export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidateAll();
}

// ---------- Experience ----------

export async function createExperience(fd: FormData) {
  await requireAdmin();
  await prisma.experience.create({
    data: {
      roleEn: str(fd.get("roleEn")),
      company: str(fd.get("company")),
      locationEn: str(fd.get("locationEn")),
      descriptionEn: str(fd.get("descriptionEn")),
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
      company: str(fd.get("company")),
      locationEn: str(fd.get("locationEn")),
      descriptionEn: str(fd.get("descriptionEn")),
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
      company: str(fd.get("company")),
      avatarUrl: strOrNull(fd.get("avatarUrl")),
      quoteEn: str(fd.get("quoteEn")),
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
      company: str(fd.get("company")),
      avatarUrl: strOrNull(fd.get("avatarUrl")),
      quoteEn: str(fd.get("quoteEn")),
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
      descriptionEn: str(fd.get("descriptionEn")),
      deliverables: JSON.stringify(deliverables),
      timelineEn: str(fd.get("timelineEn")),
      ctaLabelEn: str(fd.get("ctaLabelEn")) || "Book a meeting",
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
      descriptionEn: str(fd.get("descriptionEn")),
      deliverables: JSON.stringify(deliverables),
      timelineEn: str(fd.get("timelineEn")),
      ctaLabelEn: str(fd.get("ctaLabelEn")) || "Book a meeting",
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
  let gallery: Array<{ url: string; altEn?: string }> = [];
  try {
    gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
  } catch {
    gallery = [];
  }
  const slug = slugify(str(fd.get("slug")) || str(fd.get("titleEn")));

  await prisma.project.create({
    data: {
      slug,
      titleEn: str(fd.get("titleEn")),
      shortDescEn: str(fd.get("shortDescEn")),
      fullDescEn: str(fd.get("fullDescEn")),
      coverImage: strOrNull(fd.get("coverImage")),
      category: str(fd.get("category")) || "UX/UI",
      roleEn: str(fd.get("roleEn")),
      timelineEn: str(fd.get("timelineEn")),
      client: strOrNull(fd.get("client")),
      projectType: str(fd.get("projectType")) || "Case Study",
      tags: str(fd.get("tags")),
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
          order: i,
        })),
      },
    },
  });
  revalidateAll();
}

export async function updateProject(id: string, fd: FormData) {
  await requireAdmin();
  const galleryRaw = str(fd.get("gallery"));
  let gallery: Array<{ url: string; altEn?: string }> = [];
  try {
    gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
  } catch {
    gallery = [];
  }
  const slug = slugify(str(fd.get("slug")));

  await prisma.$transaction([
    prisma.projectImage.deleteMany({ where: { projectId: id } }),
    prisma.project.update({
      where: { id },
      data: {
        slug,
        titleEn: str(fd.get("titleEn")),
        shortDescEn: str(fd.get("shortDescEn")),
        fullDescEn: str(fd.get("fullDescEn")),
        coverImage: strOrNull(fd.get("coverImage")),
        category: str(fd.get("category")) || "UX/UI",
        roleEn: str(fd.get("roleEn")),
        timelineEn: str(fd.get("timelineEn")),
        client: strOrNull(fd.get("client")),
        projectType: str(fd.get("projectType")) || "Case Study",
        tags: str(fd.get("tags")),
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
            order: i,
          })),
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

// ---------- Project Sections ----------

export async function upsertProjectSection(input: {
  id?: string;
  projectId: string;
  type: ProjectSectionType;
  order: number;
  titleEn: string;
  bodyEn: string;
  blocks: unknown[];
}) {
  await requireAdmin();
  if (input.id) {
    await prisma.projectSection.update({
      where: { id: input.id },
      data: {
        type: input.type,
        order: input.order,
        titleEn: input.titleEn,
        bodyEn: input.bodyEn,
        blocks: JSON.stringify(input.blocks),
      },
    });
  } else {
    await prisma.projectSection.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        order: input.order,
        titleEn: input.titleEn,
        bodyEn: input.bodyEn,
        blocks: JSON.stringify(input.blocks),
      },
    });
  }
  revalidateAll();
}

export async function deleteProjectSection(id: string) {
  await requireAdmin();
  await prisma.projectSection.delete({ where: { id } });
  revalidateAll();
}

export async function reorderProjectSections(orders: Array<{ id: string; order: number }>) {
  await requireAdmin();
  await prisma.$transaction(
    orders.map((o) =>
      prisma.projectSection.update({
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
      descriptionEn: str(fd.get("descriptionEn")),
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
      descriptionEn: str(fd.get("descriptionEn")),
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
