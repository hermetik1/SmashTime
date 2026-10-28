import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "production" ? {output: "export" as const} : {}),
  env: {
    NEXT_PUBLIC_LOCAL_ADMIN_EMAIL: process.env.NODE_ENV === "production" ? "" : process.env.NEXT_PUBLIC_LOCAL_ADMIN_EMAIL || "",
    NEXT_PUBLIC_LOCAL_ADMIN_PASSWORD: process.env.NODE_ENV === "production" ? "" : process.env.NEXT_PUBLIC_LOCAL_ADMIN_PASSWORD || "",
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
