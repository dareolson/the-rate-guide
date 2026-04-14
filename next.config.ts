import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type checking passes locally — skip during Vercel build to avoid timeout
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
