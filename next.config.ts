import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      // You can add your custom domain here if you use one
    ],
  },
};

export default nextConfig;
