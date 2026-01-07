/** @type {import('next').NextConfig} */
const nextConfig = {
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
          source: '/docs/:path*',
          destination: `https://meshtastic.org/docs/:path*`,
        },
      ]
    }
  }
}

export default nextConfig
