/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'braunundeyer.de', 'cms.braunundeyer.de', 'api.braunundeyer.de', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'api.braunundeyer.de',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Enable image optimization
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/de',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;