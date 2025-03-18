import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";

const nextConfig: NextConfig = withNextIntl()({
  /* config options here */

  // // Experimental configurations
  // experimental: {
  //   staleTimes: {
  //     dynamic: 1800, // Customize cache expiration for dynamic content (e.g., dynamic routes like /product/:slug)
  //   },
  // },

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
});

export default nextConfig;
