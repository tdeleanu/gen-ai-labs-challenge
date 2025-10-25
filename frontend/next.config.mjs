/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  outputFileTracingRoot: process.cwd(),
}

export default nextConfig