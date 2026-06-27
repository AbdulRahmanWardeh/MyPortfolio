import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Case Studies were merged into Projects. Permanently redirect any
  // old case-study URLs (and the legacy locale-prefixed variants the
  // old sitemap emitted) to the projects section.
  async redirects() {
    return [
      { source: "/case-studies", destination: "/projects", permanent: true },
      { source: "/case-studies/:path*", destination: "/projects", permanent: true },
      { source: "/:locale/case-studies", destination: "/projects", permanent: true },
      { source: "/:locale/case-studies/:path*", destination: "/projects", permanent: true },
    ];
  },

  // Anchor the workspace root to this project, silencing the
  // "multiple lockfiles detected" warning when a stray lockfile
  // exists higher up the filesystem (e.g. ~/package-lock.json).
  outputFileTracingRoot: path.join(__dirname),

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: "https", hostname: "**.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "cdn.brandfetch.io" },
    ],
  },

  experimental: {
    // Modular import optimization: only the icons/animations actually
    // used in a route are bundled, instead of the whole barrel file.
    // This is the single biggest client-bundle reduction for this app.
    optimizePackageImports: [
      "framer-motion",
      "hugeicons-react",
      "lucide-react",
      "date-fns",
      "date-fns-tz",
    ],
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default withNextIntl(nextConfig);
