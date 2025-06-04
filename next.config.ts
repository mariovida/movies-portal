import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ["image.tmdb.org"],
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) => {
      return rule.test instanceof RegExp && rule.test.test(".svg");
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
