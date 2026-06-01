import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
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
