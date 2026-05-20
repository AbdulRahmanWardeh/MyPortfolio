import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/en/admin", "/ar/admin", "/en/login", "/ar/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
