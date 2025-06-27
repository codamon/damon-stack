'use client';

import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink as httpBatchLinkProxy } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '../../types/app-router';

// React组件中使用的tRPC客户端
export const api = createTRPCReact<AppRouter>();

// 非React环境使用的代理客户端 (如SSR、服务器端)
export const apiProxy = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLinkProxy({
      url: getApiUrl(),
      headers() {
        return getApiHeaders();
      },
      transformer: superjson,
    }),
  ],
});

/**
 * 获取API基础URL
 */
export function getApiUrl(): string {
  // 开发环境默认地址
  const defaultUrl = 'http://localhost:3000/api/trpc';
  
  // 优先使用环境变量配置的地址
  if (typeof window !== 'undefined') {
    // 客户端环境
    return process.env.NEXT_PUBLIC_API_URL || defaultUrl;
  } else {
    // 服务器端环境
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || defaultUrl;
  }
}

/**
 * 获取API请求头
 */
export function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 如果有认证token，添加到请求头
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * 创建tRPC客户端配置
 */
export function getTRPCClientConfig() {
  return {
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === 'development' ||
          (opts.direction === 'down' && opts.result instanceof Error),
      }),
      httpBatchLink({
        url: getApiUrl(),
        headers() {
          return getApiHeaders();
        },
        transformer: superjson,
        // 跨域配置
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include', // 包含cookies
          });
        },
      }),
    ],
  };
}

/**
 * 环境配置
 */
export const config = {
  // API相关
  apiUrl: getApiUrl(),
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  
  // 应用URL
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000',
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  blogUrl: process.env.NEXT_PUBLIC_BLOG_URL || 'http://localhost:3002',
  
  // 功能开关
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableSentry: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',
} as const;

export type Config = typeof config; 