/**
 * tRPC API 处理器
 * 这是让 Next.js App Router 能够响应 tRPC 请求的入口
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { appRouter } from '../../../../server/api/root';
import { createTRPCContext } from '../../../../server/api/trpc';

/**
 * 处理 tRPC 请求的核心函数
 * 使用 fetchRequestHandler 适配器来处理 HTTP 请求
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    /**
     * tRPC API 端点路径
     * 所有 tRPC 请求都会通过这个端点
     */
    endpoint: '/api/trpc',
    
    /**
     * 传入的 HTTP 请求对象
     */
    req,
    
    /**
     * tRPC 主路由器
     * 包含所有定义的 API 路由
     */
    router: appRouter,
    
    /**
     * 创建 tRPC 上下文
     * 为每个请求提供上下文数据
     */
    createContext: () => createTRPCContext({
      headers: Object.fromEntries(req.headers.entries()),
    }),
    
    /**
     * 错误处理配置
     * 在开发环境显示详细错误信息
     */
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });

/**
 * 导出 GET 请求处理器
 * 处理 tRPC 的 GET 请求（主要用于查询）
 */
export { handler as GET };

/**
 * 导出 POST 请求处理器  
 * 处理 tRPC 的 POST 请求（主要用于变更）
 */
export { handler as POST }; 