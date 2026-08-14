import { Link } from "@/i18n/routing";
import {
  ArrowLeft02Icon as ArrowLeft,
  SearchVisualIcon as SearchIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";

/**
 * 404 for public routes — renders inside SiteLayout, so it keeps the navbar,
 * footer and particles.
 *
 * Strings are inline rather than pulled from next-intl. A not-found boundary
 * can render without `setRequestLocale` having run for the segment, and the
 * translation helpers throw in that state during static generation. The site
 * is English-only, so there's nothing to lose here.
 */
export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[58vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
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
        The link may be broken, or the page may have been moved. Let&rsquo;s get
        you back on track.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/projects">
            <SearchIcon className="h-4 w-4" />
            Browse projects
          </Link>
        </Button>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-tint/45">
        {[
          { href: "/about", label: "About" },
          { href: "/services", label: "Services" },
          { href: "/contact", label: "Book a meeting" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="underline-offset-4 transition hover:text-tint hover:underline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
