// ==============================================
// The Rate Guide — Sitemap
// Auto-generated and submitted to Google.
// Add new pages here as the site grows.
// ==============================================

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://therateguide.com";

  return [
    {
      url:              `${base}/`,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         1.0,   // homepage — highest priority
    },
    {
      url:              `${base}/methodology`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.9,   // high-value SEO content
    },
    {
      url:              `${base}/store`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.7,
    },
    {
      url:              `${base}/login`,
      lastModified:     new Date(),
      changeFrequency:  "yearly",
      priority:         0.3,   // low priority — no SEO value
    },
  ];
}
