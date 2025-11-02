/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable Turbopack for build
  experimental: {
    turbo: {
      resolveAlias: {
        // Empty object disables Turbopack type checking
      }
    }
  }
};

module.exports = nextConfig;