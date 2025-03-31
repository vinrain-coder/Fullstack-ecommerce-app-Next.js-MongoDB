import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const nextConfig: NextConfig = withNextIntl()({
  // ✅ Enable React strict mode for catching errors
  reactStrictMode: true,

  // ✅ Experimental features
  experimental: {
    staleTimes: {
      dynamic: 1800, // Cache dynamic pages for 30 minutes
    },
  },

  // ✅ ESLint & TypeScript settings (avoiding build interruptions)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
    ],
    minimumCacheTTL: 31 * 24 * 60 * 60, // Cache images for 31 days
    formats: ["image/webp"], // Only use WebP for optimization
    deviceSizes: [320, 420, 768, 1024, 1200], // Optimize for key device sizes
    imageSizes: [16, 24, 32, 48, 64, 96], // Optimize small UI elements
  },

  // ✅ Webpack optimizations for better performance
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      "fs/promises": false,
      "timers/promises": false,
    };
    return config;
  },
});

export default nextConfig;
