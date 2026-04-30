import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all for MVP, or specify R2 public URL
      },
    ],
  },
};

export default nextConfig;
