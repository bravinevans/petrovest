import { NextConfig } from "next/dist/server/config";

const nextConfig: NextConfig = {
  // images are served straight from TMDB, skip the host's paid image optimization
  images: {
    unoptimized: true,
  },
  // https://github.com/payloadcms/payload/issues/12550#issuecomment-2939070941
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  experimental: {
    optimizePackageImports: ["@heroui/react"],
    prefetchInlining: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "downloads.petrovest.co.ke" }],
        destination: "/downloads",
      },
    ];
  },
};

export default nextConfig;
