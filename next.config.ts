import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/projects",
        destination: "/projeler",
      },
      {
        source: "/projects/:slug",
        destination: "/projeler/:slug",
      },
      {
        source: "/about",
        destination: "/hakkimizda",
      },
      {
        source: "/contact",
        destination: "/iletisim",
      },
      {
        source: "/press",
        destination: "/basinda-biz",
      },
    ];
  },
};

export default nextConfig;
