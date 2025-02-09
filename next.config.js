// @ts-check

/** @type {import('next').NextConfig} */
export default {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { serverActions: true },
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
}
