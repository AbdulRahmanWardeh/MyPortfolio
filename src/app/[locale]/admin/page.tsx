import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { format } from "date-fns";
import {
  Briefcase,
  FileText,
  Calendar,
  Star,
  Wrench,
  Users,
} from "lucide-react";

const STATS = [
  { key: "projects", icon: Briefcase, label: "Projects" },
  { key: "caseStudies", icon: FileText, label: "Case Studies" },
  { key: "services", icon: Wrench, label: "Services" },
  { key: "experience", icon: Users, label: "Experience" },
  { key: "testimonials", icon: Star, label: "Testimonials" },
  { key: "bookings", icon: Calendar, label: "Bookings" },
] as const;

export default async function AdminOverviewPage() {
  const [
    projectsCount,
    caseStudiesCount,
    servicesCount,
    experienceCount,
    testimonialsCount,
    bookingsCount,
    recentBookings,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.caseStudy.count(),
    prisma.service.count(),
    prisma.experience.count(),
    prisma.testimonial.count(),
    prisma.booking.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { meetingType: true },
    }),
  ]);

  const counts: Record<string, number> = {
    projects: projectsCount,
    caseStudies: caseStudiesCount,
    services: servicesCount,
    experience: experienceCount,
    testimonials: testimonialsCount,
    bookings: bookingsCount,
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your portfolio content and recent bookings."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key}>
              <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
                <CardDescription className="m-0">{s.label}</CardDescription>
                <Icon className="h-4 w-4 text-white/40" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-semibold tracking-tight">
                  {counts[s.key] ?? 0}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
          <CardDescription>Latest 6 booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-white/50">No bookings yet.</p>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {recentBookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium">{b.name}</div>
                    <div className="text-xs text-white/50">
                      {b.meetingType?.nameEn} · {format(b.date, "MMM d")} at {b.startTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={b.status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"} />
                    <Link
                      href="/admin/bookings"
                      className="text-xs text-white/60 hover:text-white"
                    >
                      View →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            { href: "/admin/hero", label: "Edit Hero" },
            { href: "/admin/about", label: "Edit About" },
            { href: "/admin/projects", label: "Manage Projects" },
            { href: "/admin/case-studies", label: "Case Studies" },
            { href: "/admin/services", label: "Services" },
            { href: "/admin/availability", label: "Availability" },
          ].map((l) => (
            <Link key={l.href} href={l.href}>
              <Badge variant="outline">{l.label}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
