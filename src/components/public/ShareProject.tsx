"use client";

import * as React from "react";
import { Link as LinkIcon, Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Target = { label: string; href: (url: string, title: string) => string };

const TARGETS: Target[] = [
  {
    label: "X",
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "LinkedIn",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "WhatsApp",
    href: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

/**
 * Share controls for a project. The canonical URL is passed from the server so
 * shared links never leak localhost or query params; `window.location` is only
 * a fallback if that's unavailable.
 */
export function ShareProject({
  url,
  title,
  label = "Share this project",
}: {
  url: string;
  title: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [canNativeShare, setCanNativeShare] = React.useState(false);

  // navigator.share is absent on most desktops — only offer it once mounted.
  React.useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the visible URL targets still work */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url: shareUrl });
    } catch {
      /* user dismissed the sheet */
    }
  };

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border border-tint/[0.10] bg-tint/[0.03] px-3.5 py-1.5 text-sm text-tint/85 transition hover:border-tint/30 hover:bg-tint hover:text-background";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="me-1 text-xs uppercase tracking-wide text-tint/40">
        {label}
      </span>

      <button type="button" onClick={copy} className={cn(pill)}>
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <LinkIcon className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied!" : "Copy link"}
      </button>

      {TARGETS.map((t) => (
        <a
          key={t.label}
          href={t.href(shareUrl, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(pill)}
        >
          {t.label}
        </a>
      ))}

      {canNativeShare ? (
        <button type="button" onClick={nativeShare} className={cn(pill)}>
          <Share2 className="h-3.5 w-3.5" />
          More
        </button>
      ) : null}
    </div>
  );
}
