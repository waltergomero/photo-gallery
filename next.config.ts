import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode for better development experience
  
  typescript: {
    ignoreBuildErrors: false, // Don't ignore TypeScript errors in production
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Don't ignore ESLint errors during builds
  },

  // Image optimization configuration
  images: {
    domains: ['localhost'], // Add your image domains here
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['react-icons', 'lodash'],
  },

  // Compression
  compress: true,

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/gallery',
        destination: '/grid/All',
        permanent: true,
      },
    ];
  },

  // Webpack configuration for better build optimization (only for production builds)
  webpack: (config, { isServer, dev }) => {
    // Only apply webpack optimizations for production builds, not with Turbopack in dev
    if (dev) return config;
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
};

export default nextConfig;
