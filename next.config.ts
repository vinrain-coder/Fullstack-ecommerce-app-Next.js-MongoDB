import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */

  // Experimental configurations
  experimental: {
    staleTimes: {
      dynamic: 60, // Customize cache expiration for dynamic content (e.g., dynamic routes like /product/:slug)
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
        hostname: "utfs.io", // Remote image hosting
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc", // Adding i.postimg.cc
      },
    ],
  },

  // Caching Configuration with Cache-Control headers
  async headers() {
    return [
      {
        // Apply caching headers for product details pages with dynamic slug
        source: "/product/:slug", // Handle different locales for product pages
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale content for 1 day
          },
        ],
      },
      {
        // Apply caching headers for the homepage
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400", // Cache for 1 hour, stale content for 1 day
          },
        ],
      },
    ];
  },
});

export default nextConfig;
