/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://meshtastic.org/:path*`,
        },
      ]
    }
  }
}

export default nextConfig
