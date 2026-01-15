const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
};

// Configuración para Cloudflare Pages
if (process.env.CF_PAGES === '1' || process.env.CF_PAGES_BRANCH) {
  const { withCloudflarePagesAdapter } = require('@cloudflare/next-on-pages/next-config');
  module.exports = withCloudflarePagesAdapter(nextConfig);
} else {
  module.exports = nextConfig;
}
