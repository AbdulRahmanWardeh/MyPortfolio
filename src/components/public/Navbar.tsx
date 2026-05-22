"use client";

import * as React from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu02Icon } from "hugeicons-react";
import { DynamicIcon } from "@/lib/hugeicon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
// Kept around — re-enable in JSX below to show the EN/AR switcher again.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LocaleSwitcher as _LocaleSwitcher } from "./LocaleSwitcher";

const links = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/services", key: "services" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar({
  siteName: _siteName,
  ctaIcon,
}: {
  siteName: string;
  ctaIcon?: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:px-6 md:pt-6"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          "flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 rounded-[999px] border px-3 transition-all md:grid md:h-20 md:grid-cols-[1fr_auto_1fr] md:px-5",
          scrolled
            ? "border-white/[0.10] bg-background/70 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]"
            : "border-white/[0.08] bg-white/[0.03] backdrop-blur-md",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 justify-self-start ps-2"
          aria-label="Home"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={24}
            height={24}
            className="h-6 w-6"
            priority
          />
        </Link>

        <nav className="hidden items-center justify-self-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                isActive(l.href)
                  ? "bg-white/[0.06] text-white"
                  : "text-white/65 hover:text-white",
              )}
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-2">
          {/* LocaleSwitcher kept for future use — see ./LocaleSwitcher.tsx */}
          <Button asChild variant="accent" size="sm" className="hidden md:inline-flex">
            <Link href="/contact">
              {t("bookMeeting")}
              {ctaIcon ? (
                <DynamicIcon
                  name={ctaIcon}
                  className="h-3.5 w-3.5 rtl:rotate-[-90deg]"
                />
              ) : null}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label={t("menu")}
              >
                <Menu02Icon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={locale === "ar" ? "left" : "right"}
              className="flex flex-col gap-6"
            >
              <SheetTitle className="text-sm uppercase tracking-wide text-white/50">
                {t("menu")}
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "rounded-2xl px-3 py-3 text-lg",
                        isActive(l.href)
                          ? "bg-white/[0.06] text-white"
                          : "text-white/70 hover:bg-white/[0.04]",
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild variant="accent" className="w-full">
                  <Link href="/contact">{t("bookMeeting")}</Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
