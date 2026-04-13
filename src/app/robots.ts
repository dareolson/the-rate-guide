// ==============================================
// The Rate Guide — robots.txt
// Tells search crawlers what they can index.
// Dashboard is excluded — private user data.
// ==============================================

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/methodology", "/store"],
        disallow:  ["/dashboard", "/auth"],  // private pages — no indexing
      },
    ],
    sitemap: "https://therateguide.com/sitemap.xml",
  };
}
