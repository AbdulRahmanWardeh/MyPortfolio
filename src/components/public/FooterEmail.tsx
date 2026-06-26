"use client";

import * as React from "react";
import { Copy01Icon, Tick02Icon } from "hugeicons-react";

/**
 * Click → copies the email to clipboard, briefly shows a confirmation tick.
 * Right-click / long-press still surfaces the mailto behaviour via the
 * anchor wrapper around the visible label.
 */
export function FooterEmail({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback: open the mail client when clipboard isn't available.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${email}`}
      className="group inline-flex items-center gap-3 rounded-full border border-tint/[0.12] bg-tint/[0.04] px-5 py-3 text-sm font-medium text-tint/80 transition hover:border-tint/40 hover:bg-tint hover:text-[rgb(var(--footer-surface))]"
    >
      <span>{email}</span>
      {copied ? (
        <Tick02Icon className="h-4 w-4 text-emerald-400 group-hover:text-emerald-600" />
      ) : (
        <Copy01Icon className="h-4 w-4 opacity-70" />
      )}
    </button>
  );
}
