/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/monastery/:id/directions",
        destination: "/monter/:id/direction",
        permanent: false,
      },
    ]
  },
}

export default nextConfig