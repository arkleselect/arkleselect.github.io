import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds, allowing dynamic API routes in dev
  output: process.env.NODE_ENV === 'production' ? "export" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
