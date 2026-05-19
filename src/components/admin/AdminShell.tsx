"use client";

import * as React from "react";
import {
  LayoutDashboard,
  User,
  Sparkles,
  Briefcase,
  FileText,
  Wrench,
  Users,
  Star,
  Link as LinkIcon,
  Calendar,
  Clock,
  Settings,
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
  Palette,
  MessageSquare,
  Heart,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, group: "" },

  { href: "/admin/hero", label: "Hero", icon: Sparkles, group: "Content" },
  { href: "/admin/about", label: "About", icon: User, group: "Content" },
  { href: "/admin/skills", label: "Skills", icon: Heart, group: "Content" },
  { href: "/admin/projects", label: "Projects", icon: Briefcase, group: "Content" },
  { href: "/admin/case-studies", label: "Case Studies", icon: FileText, group: "Content" },
  { href: "/admin/services", label: "Services", icon: Wrench, group: "Content" },
  { href: "/admin/experience", label: "Experience", icon: Users, group: "Content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star, group: "Content" },
  { href: "/admin/tools", label: "Tools", icon: Wrench, group: "Content" },
  { href: "/admin/social-links", label: "Social Links", icon: LinkIcon, group: "Content" },
  { href: "/admin/contact-cta", label: "Contact CTA", icon: MessageSquare, group: "Content" },
  { href: "/admin/footer", label: "Footer", icon: ArrowLeftRight, group: "Content" },

  { href: "/admin/bookings", label: "Bookings", icon: Calendar, group: "Booking" },
  { href: "/admin/meeting-types", label: "Meeting Types", icon: Clock, group: "Booking" },
  { href: "/admin/availability", label: "Availability", icon: Calendar, group: "Booking" },

  { href: "/admin/seo", label: "SEO", icon: Settings, group: "Settings" },
  { href: "/admin/settings", label: "Settings", icon: Palette, group: "Settings" },
];

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email: string; name?: string | null };
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const groups = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 start-0 z-30 w-72 transform overflow-y-auto border-e border-white/[0.06] bg-[#0a0a0a] transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-16 items-center justify-between px-5 border-b border-white/[0.06]">
            <Link href="/admin" className="text-sm font-medium tracking-tight">
              Admin
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-white/60 hover:bg-white/[0.06] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="mt-3 first:mt-0">
                {group ? (
                  <div className="px-3 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/30">
                    {group}
                  </div>
                ) : null}
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-white/[0.06] text-white"
                          : "text-white/65 hover:bg-white/[0.04] hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-3">
            <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="truncate text-sm font-medium">{user.name ?? "Admin"}</div>
              <div className="truncate text-xs text-white/40">{user.email}</div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-2 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-background/70 px-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-md p-1.5 text-white/60 hover:bg-white/[0.06] lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span className="text-sm text-white/60">
                {pathname.replace(/^\/(en|ar)/, "") || "/"}
              </span>
            </div>
            <Link
              href="/"
              className="text-xs text-white/60 underline-offset-4 hover:underline"
            >
              View site →
            </Link>
          </header>

          <main className="flex-1 p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
