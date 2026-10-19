import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Put the (small, Tailwind) stylesheet in the HTML so first-time visitors don't wait for a
    // separate render-blocking CSS request.
    inlineCss: true,
  },
};

export default nextConfig;
