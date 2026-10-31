import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ng.jumia.is" },
      { protocol: "https", hostname: "taeillo.com" },
      { protocol: "https", hostname: "pictures-nigeria.jijistatic.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
};

export default nextConfig;
