"use client";

import * as React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  label: string;
  icon: React.ReactNode;
  onNavigate?: () => void;
}

/**
 * Single sidebar item. Owns its own active-state subscription so the
 * parent shell can render entirely on the server. The icon arrives
 * pre-rendered as JSX — that keeps the LucideIcon function reference
 * out of the RSC props payload.
 */
export function AdminNavLink({ href, label, icon, onNavigate }: Props) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-white/[0.06] text-white"
          : "text-white/60 hover:bg-white/[0.04] hover:text-white",
      )}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "absolute inset-y-1.5 start-0 w-[2px] rounded-full bg-accent transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />
      <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  );
}
