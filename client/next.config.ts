import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url"),
    };

    // Enable source maps in development
    if (dev && !isServer) {
      config.devtool = "source-map";
    }

    return config;
  },
  experimental: {
    turbo: {
      resolveExtensions: [
        ".mdx",
        ".tsx",
        ".ts",
        ".jsx",
        ".js",
        ".mjs",
        ".json",
      ],
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
