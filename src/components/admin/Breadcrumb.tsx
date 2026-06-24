"use client";

import { usePathname } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";

/**
 * Tiny pathname breadcrumb for the admin topbar — depends on
 * usePathname() so it has to be a client component.
 */
export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/(?:en|ar)/, "").split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-white/55"
    >
      {segments.length === 0 ? (
        <span>Admin</span>
      ) : (
        segments.map((seg, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            {i > 0 ? (
              <ChevronRight className="h-3 w-3 text-white/25" aria-hidden />
            ) : null}
            <span className={i === segments.length - 1 ? "text-white/85 capitalize" : "capitalize"}>
              {seg.replaceAll("-", " ")}
            </span>
          </span>
        ))
      )}
    </nav>
  );
}
