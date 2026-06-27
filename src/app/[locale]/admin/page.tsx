import Link from "next/link";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  Star,
  Wrench,
  Users,
  ArrowUpRight,
  Clock,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { getAdminCounts, getRecentBookings } from "@/lib/admin";

interface StatDef {
  key: keyof Awaited<ReturnType<typeof getAdminCounts>>;
  label: string;
  icon: LucideIcon;
  href: string;
}

const STATS: StatDef[] = [
  { key: "projects", label: "Projects", icon: Briefcase, href: "/admin/projects" },
  { key: "services", label: "Services", icon: Wrench, href: "/admin/services" },
  { key: "experience", label: "Experience", icon: Users, href: "/admin/experience" },
  { key: "testimonials", label: "Testimonials", icon: Star, href: "/admin/testimonials" },
  { key: "bookings", label: "Bookings", icon: Calendar, href: "/admin/bookings" },
];

const QUICK_LINKS: { href: string; label: string }[] = [
  { href: "/admin/hero", label: "Edit Hero" },
  { href: "/admin/about", label: "Edit About" },
  { href: "/admin/projects", label: "Manage Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/availability", label: "Availability" },
];

export default async function AdminOverviewPage() {
  const [counts, recentBookings] = await Promise.all([
    getAdminCounts(),
    getRecentBookings(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your portfolio content and recent bookings."
      />

      {counts.pendingBookings > 0 ? (
        <Link
          href="/admin/bookings"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/[0.06] px-5 py-4 transition hover:border-accent/60"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/15 text-accent">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-medium text-white">
                {counts.pendingBookings} pending {counts.pendingBookings === 1 ? "booking" : "bookings"}
              </div>
              <div className="text-xs text-white/55">
                Review and confirm new meeting requests
              </div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-white/55 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </Link>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              href={s.href}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] text-white/70 group-hover:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white/70" />
              </div>
              <div className="mt-5 text-3xl font-semibold tracking-tight text-white">
                {counts[s.key]}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.15em] text-white/45">
                {s.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-baseline justify-between">
              <div>
                <CardTitle>Recent bookings</CardTitle>
                <CardDescription>Latest meeting requests</CardDescription>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs text-white/60 underline-offset-4 hover:text-white hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-white/50">No bookings yet.</p>
            ) : (
              <ul className="divide-y divide-white/[0.04]">
                {recentBookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white">
                        {b.name}
                      </div>
                      <div className="truncate text-xs text-white/50">
                        {b.meetingType?.nameEn} · {format(b.date, "MMM d")} at{" "}
                        {b.startTime}
                      </div>
                    </div>
                    <BookingStatusBadge
                      status={
                        b.status as
                          | "PENDING"
                          | "CONFIRMED"
                          | "CANCELLED"
                          | "COMPLETED"
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>Jump straight to common edits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-white/75 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
