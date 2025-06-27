import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 实验性功能配置
   */
  experimental: {
    // 优化服务器端组件和客户端组件边界
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },

  /**
   * 编译器选项
   */
  compiler: {
    // 移除生产环境中的 console.log
    removeConsole: process.env.NODE_ENV === 'production',
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
    domains: ['localhost'],
  },
};

export default nextConfig; 