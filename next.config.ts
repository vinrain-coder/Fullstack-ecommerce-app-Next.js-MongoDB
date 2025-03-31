import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */

  // Experimental configurations
  experimental: {
    staleTimes: {
      dynamic: 1800,
    },
  },

  // ESLint and TypeScript settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
    minimumCacheTTL: 2678400, // Cache images for 31 days
    formats: ["image/webp"], // Only use WebP for optimization
    deviceSizes: [320, 420, 768, 1024, 1200], // Limit device sizes
    imageSizes: [16, 24, 32, 48, 64, 96], // Restrict extra sizes
  },
});

export default nextConfig;
