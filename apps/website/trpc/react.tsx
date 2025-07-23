'use client';

/**
 * tRPC React 客户端配置
 * 配置 React Query 和 tRPC 的客户端，以便在组件中调用 API
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';

// 从admin-dashboard导入AppRouter类型
import type { AppRouter } from '../../admin-dashboard/server/api/root';

/**
 * 创建 tRPC React 客户端实例
 * 类型参数指定了服务端的路由器类型，确保类型安全
 */
export const api = createTRPCReact<AppRouter>();

/**
 * TRPCReactProvider 组件
 * 为整个应用提供 tRPC 和 React Query 的上下文
 */
export function TRPCReactProvider(props: {
  children: React.ReactNode;
}) {
  /**
   * 创建 QueryClient 实例
   * 配置 React Query 的全局设置
   */
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * 数据在 60 秒内被认为是新鲜的
         * 减少不必要的重新获取
         */
        staleTime: 60 * 1000,
        
        /**
         * 缓存时间：5 分钟
         * 数据在内存中保持的时间
         */
        gcTime: 5 * 60 * 1000,
        
        /**
         * 失败时重试 1 次
         */
        retry: 1,
        
        /**
         * 窗口聚焦时重新获取数据
         */
        refetchOnWindowFocus: false,
      },
    },
  }));

  /**
   * 创建 tRPC 客户端实例
   * 配置与服务端 API 的通信
   */
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        /**
         * HTTP Batch Link
         * 将多个请求批量处理为单个 HTTP 请求
         * 提高性能并减少网络开销
         * 配置 superjson 进行序列化，确保 Date、Map、Set 等复杂类型正确传输
         */
        httpBatchLink({
          /**
           * API 端点 URL
           * 注意：这里指向admin-dashboard的API端点
           */
          url: 'http://localhost:3000/api/trpc',
          
          /**
           * 配置 superjson transformer
           * 确保复杂类型如 Date 对象能正确序列化
           */
          transformer: superjson,
          
          /**
           * 自定义请求头
           * 可以用于添加认证令牌等
           */
          async headers() {
            return {
              // 可以在这里添加认证头等
              // authorization: getAuthToken(),
            };
          },
        }),
      ],
    })
  );

  return (
    /**
     * 提供 tRPC 客户端上下文
     */
    <api.Provider client={trpcClient} queryClient={queryClient}>
      {/**
       * 提供 React Query 上下文
       */}
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
} 