/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Docker production build
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  images: {
    domains: ['localhost', 'backend', 'braunundeyer.de', 'cms.braunundeyer.de', 'api.braunundeyer.de', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
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
        protocol: 'http',
        hostname: 'backend',
        port: '3001',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3001',
        pathname: '/images/**',
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
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
    formats: ['image/webp'],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://backend:3001';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    return [
      // Proxy uploads directly to backend for Docker compatibility
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      // API proxy
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
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
