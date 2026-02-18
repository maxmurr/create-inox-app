import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  output: "standalone",
  env: { SOURCE_VERSION: process.env.SOURCE_VERSION ?? "dev" },
};

export default nextConfig;
