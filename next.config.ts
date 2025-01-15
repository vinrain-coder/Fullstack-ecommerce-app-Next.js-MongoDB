import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */
  // Experimental configurations (unchanged)
  experimental: {
    staleTimes: {
      dynamic: 60, // Customize cache expiration for dynamic content
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
});

export default nextConfig;
