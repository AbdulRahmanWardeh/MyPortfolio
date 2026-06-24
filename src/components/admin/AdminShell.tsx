import * as React from "react";
import { Link } from "@/i18n/routing";
import { ADMIN_NAV } from "./admin-nav";
import { AdminNavLink } from "./AdminNavLink";
import { AdminMobileNav } from "./AdminMobileNav";
import { SignOutButton } from "./SignOutButton";
import { AdminBreadcrumb } from "./Breadcrumb";

/**
 * Admin chrome. Server component — the sidebar is plain markup;
 * only the active-state Link, mobile drawer and sign-out button are
 * client islands.
 */
export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email: string; name?: string | null };
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        {/* Sidebar — desktop only; mobile uses AdminMobileNav drawer */}
        <aside className="sticky top-0 hidden h-screen flex-col border-e border-white/[0.06] bg-[#0a0a0a] lg:flex">
          <div className="flex h-14 items-center border-b border-white/[0.06] px-5">
            <Link
              href="/admin"
              className="text-sm font-semibold tracking-tight text-white"
            >
              Admin
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {ADMIN_NAV.map((group) => (
              <div key={group.label ?? "_root"} className="mt-4 first:mt-0">
                {group.label ? (
                  <div className="px-3 pb-1 pt-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/30">
                    {group.label}
                  </div>
                ) : null}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((it) => {
                    const Icon = it.icon;
                    return (
                      <AdminNavLink
                        key={it.href}
                        href={it.href}
                        label={it.label}
                        icon={<Icon />}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/[0.06] p-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="truncate text-sm font-medium">
                {user.name ?? "Admin"}
              </div>
              <div className="mt-0.5 truncate text-xs text-white/40">
                {user.email}
              </div>
              <SignOutButton className="mt-3 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white" />
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/80 px-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <AdminMobileNav user={user} />
              <AdminBreadcrumb />
            </div>
            <Link
              href="/"
              className="text-xs text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              View site →
            </Link>
          </header>

          <main className="flex-1 p-5 md:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
