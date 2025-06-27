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
   * Webpack 配置优化
   */
  webpack: (config, { isServer }) => {
    // 优化 bcrypt 在服务器端的构建
    if (isServer) {
      config.externals.push('bcryptjs');
    }

    return config;
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
   * 强制动态渲染
   */
  // experimental: {
  //   ...experimental,
  //   ppr: false,
  // },

  /**
   * 图片优化配置
   */
  images: {
    domains: ['localhost'],
  },

  /**
   * 跨域配置 - 允许前端应用访问API
   */
  async headers() {
    return [
      {
        // 匹配所有API路由
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NODE_ENV === 'production' 
            ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
            : '*' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
      {
        // 匹配tRPC路由
        source: '/api/trpc/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NODE_ENV === 'production'
            ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
            : '*'
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, trpc-batch-mode' },
        ],
      },
    ];
  },
};

export default nextConfig;
