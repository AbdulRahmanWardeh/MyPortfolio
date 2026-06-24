"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        className ??
        "inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
      }
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
