import { notFound } from "next/navigation";

/**
 * Lowest-priority catch-all that hands unmatched public URLs to
 * `(site)/not-found.tsx`.
 *
 * Next only falls back to the ROOT `app/not-found.tsx` for URLs that match no
 * route at all, and that one renders without the navbar or footer. Matching
 * here instead means `notFound()` is thrown *inside* SiteLayout, so a typo'd
 * address gets the branded 404 with full site chrome.
 *
 * Static and dynamic segments both outrank a catch-all in Next's matcher, so
 * this never shadows a real route.
 */
export default function CatchAllNotFound(): never {
  notFound();
}
