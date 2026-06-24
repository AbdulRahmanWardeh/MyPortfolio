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
  Palette,
  MessageSquare,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string | null;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: null,
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/hero", label: "Hero", icon: Sparkles },
      { href: "/admin/about", label: "About", icon: User },
      { href: "/admin/projects", label: "Projects", icon: Briefcase },
      { href: "/admin/case-studies", label: "Case Studies", icon: FileText },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/experience", label: "Experience", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/social-links", label: "Social Links", icon: LinkIcon },
      { href: "/admin/contact-cta", label: "Contact CTA", icon: MessageSquare },
      { href: "/admin/footer", label: "Footer", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Booking",
    items: [
      { href: "/admin/bookings", label: "Bookings", icon: Calendar },
      { href: "/admin/meeting-types", label: "Meeting Types", icon: Clock },
      { href: "/admin/availability", label: "Availability", icon: Calendar },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/seo", label: "SEO", icon: Settings },
      { href: "/admin/settings", label: "Site", icon: Palette },
    ],
  },
];
