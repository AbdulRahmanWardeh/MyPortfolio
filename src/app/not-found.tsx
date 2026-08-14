import Link from "next/link";

/**
 * Root 404 fallback.
 *
 * Only reachable when the failure happens above the locale segment — e.g.
 * `[locale]/layout.tsx` calling `notFound()` for an unknown locale. That
 * layout is the one that throws, so neither it nor the site chrome renders,
 * which means no NextIntlClientProvider and no Navbar here. Everything below
 * is therefore self-contained: `next/link` rather than the locale-aware one
 * from @/i18n/routing, literal strings, and theme tokens only.
 *
 * Ordinary bad URLs land on `[locale]/(site)/not-found.tsx` instead, which
 * keeps the full site chrome.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-tint/40">
        Error 404
      </span>

      <p
        aria-hidden
        className="h-display mt-4 select-none text-[5.5rem] font-bold leading-none tracking-tighter text-tint/[0.08] sm:text-[8rem]"
      >
        404
      </p>

      <h1 className="h-display -mt-4 text-balance text-3xl font-semibold sm:-mt-6 md:text-4xl">
        This page doesn&rsquo;t exist
      </h1>

      <p className="mt-4 max-w-md text-pretty text-base text-tint/60">
        The link may be broken, or the page may have been moved.
      </p>

      <Link
        href="/"
        className="btn-tint-3d mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium transition-all active:scale-[0.98]"
      >
        Back to home
      </Link>
    </div>
  );
}
