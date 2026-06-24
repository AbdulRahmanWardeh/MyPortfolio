"use client";

import * as React from "react";
import { Menu, X, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ADMIN_NAV } from "./admin-nav";
import { AdminNavLink } from "./AdminNavLink";

/**
 * Mobile drawer + signout button. Kept as a small isolated client
 * island so the rest of the admin shell can stay server-rendered.
 */
export function AdminMobileNav({
  user,
}: {
  user: { email: string; name?: string | null };
}) {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md p-1.5 text-white/70 hover:bg-white/[0.06] hover:text-white lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal>
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <aside className="absolute inset-y-0 start-0 flex w-[300px] max-w-[85vw] flex-col border-e border-white/[0.06] bg-[#0a0a0a]">
            <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-5">
              <span className="text-sm font-medium tracking-tight">Admin</span>
              <button
                onClick={close}
                className="rounded-md p-1.5 text-white/60 hover:bg-white/[0.06] hover:text-white"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
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
                          onNavigate={close}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t border-white/[0.06] p-3">
              <div className="truncate text-sm font-medium">
                {user.name ?? "Admin"}
              </div>
              <div className="truncate text-xs text-white/40">{user.email}</div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-3 inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
