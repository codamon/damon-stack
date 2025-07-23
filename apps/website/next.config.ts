import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 实验性功能配置
   */
  experimental: {
    // 优化服务器端组件和客户端组件边界
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@tabler/icons-react'],
  },

  /**
   * 编译器选项
   */
  compiler: {
    // 移除生产环境中的 console.log，但保留错误和警告
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  /**
   * TypeScript 配置
   */
  typescript: {
    // 在构建时忽略 TypeScript 错误（可根据需要调整）
    ignoreBuildErrors: true,
  },

  /**
   * ESLint 配置
   */
  eslint: {
    // 在构建时忽略 ESLint 错误（可根据需要调整）
    ignoreDuringBuilds: true,
  },

  /**
   * 输出配置
   */
  output: 'standalone',

  /**
   * 实验性功能 - 禁用静态生成以解决 useSearchParams 问题
   */
  trailingSlash: false,

  /**
   * 图片优化配置
   */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.damon-stack.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
    ],
  },

  /**
   * 压缩配置
   */
  compress: true,

  /**
   * 严格模式
   */
  reactStrictMode: true,

  /**
   * 性能优化配置
   */
  onDemandEntries: {
    // 页面在内存中保持的时间
    maxInactiveAge: 25 * 1000,
    // 同时保持在内存中的页面数
    pagesBufferLength: 2,
  },

  /**
   * Headers配置 - 安全和缓存优化
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  /**
   * Webpack配置优化
   */
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 主要依赖包单独打包
          vendor: {
            chunks: 'all',
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          // Mantine相关组件
          mantine: {
            chunks: 'all',
            name: 'mantine',
            test: /[\\/]node_modules[\\/]@mantine[\\/]/,
            priority: 30,
          },
          // 图标包
          icons: {
            chunks: 'all',
            name: 'icons',
            test: /[\\/]node_modules[\\/]@tabler[\\/]icons-react[\\/]/,
            priority: 25,
          },
          // 公共组件
          common: {
            chunks: 'all',
            name: 'common',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig; 