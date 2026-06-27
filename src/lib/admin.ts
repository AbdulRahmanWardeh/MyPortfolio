import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

const TTL = 30;

export interface AdminCounts {
  projects: number;
  services: number;
  experience: number;
  testimonials: number;
  bookings: number;
  pendingBookings: number;
}

/**
 * Counts shown on the admin overview. Wrapped with React cache so a
 * single render reuses one DB roundtrip, and with unstable_cache so
 * repeat renders inside TTL avoid the DB entirely.
 */
export const getAdminCounts = cache(
  unstable_cache(
    async (): Promise<AdminCounts> => {
      const [
        projects,
        services,
        experience,
        testimonials,
        bookings,
        pendingBookings,
      ] = await Promise.all([
        prisma.project.count(),
        prisma.service.count(),
        prisma.experience.count(),
        prisma.testimonial.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "PENDING" } }),
      ]);
      return {
        projects,
        services,
        experience,
        testimonials,
        bookings,
        pendingBookings,
      };
    },
    ["admin-counts"],
    { revalidate: TTL, tags: ["admin", "content"] },
  ),
);

export const getRecentBookings = cache(
  unstable_cache(
    async (take = 6) =>
      prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        take,
        include: { meetingType: true },
      }),
    ["admin-recent-bookings"],
    { revalidate: TTL, tags: ["admin", "bookings"] },
  ),
);
