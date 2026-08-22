"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

/**
 * Resolved at build time — NEXT_PUBLIC_* vars are inlined, so `enabled` is the
 * same value on the server and the client. That matters: it lets the provider
 * bail out early without changing the tree shape between renders, which would
 * otherwise remount the whole app after hydration.
 *
 * No key configured means analytics silently no-op, matching how Resend and
 * Google Calendar behave in this codebase.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const enabled = Boolean(POSTHOG_KEY);

/**
 * The App Router never does a full page load between routes, so PostHog's
 * automatic pageview capture only ever fires once. We turn it off and capture
 * on every pathname/query change instead.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!enabled || !pathname) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!enabled) return;
    posthog.init(POSTHOG_KEY as string, {
      api_host: POSTHOG_HOST,
      // We capture these ourselves in PageviewTracker.
      capture_pageview: false,
      // Records how long someone actually stayed on a route.
      capture_pageleave: true,
      // Honour the browser's Do Not Track signal.
      respect_dnt: true,
      persistence: "localStorage+cookie",
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      {/*
        useSearchParams() forces everything above it into client-side rendering
        unless it sits behind a Suspense boundary — without this the whole app
        deopts and `next build` fails.
      */}
      <React.Suspense fallback={null}>
        <PageviewTracker />
      </React.Suspense>
      {children}
    </PHProvider>
  );
}
