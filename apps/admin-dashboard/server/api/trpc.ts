/**
 * tRPC 核心配置文件
 * 这是 tRPC 的心脏，定义了上下文、实例和基础构建块
 * 包含权限控制和认证中间件
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { db } from '@damon-stack/db';
import { auth } from '../../auth';

/**
 * 1. 创建 tRPC Context
 * 包含数据库客户端、请求头和用户会话信息
 */
export const createTRPCContext = async (opts?: { headers?: Record<string, string> }) => {
  // 获取当前用户会话
  const session = await auth();
  
  return {
    db,
    session,
    headers: opts?.headers ?? {},
  };
};

/**
 * 2. tRPC 实例初始化
 * 使用 @trpc/server 的 initTRPC 方法创建一个 tRPC 实例
 * 配置 superjson 进行序列化，确保 Date、Map、Set 等复杂类型正确传输
 */
const t = initTRPC
  .context<typeof createTRPCContext>()
  .create({
    transformer: superjson,
  });

/**
 * 3. 权限控制中间件
 */

/**
 * 认证中间件
 * 检查用户是否已登录
 */
const isAuthed = t.middleware(async ({ ctx, next }) => {
  // 检查是否存在有效的用户会话
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '您需要登录才能访问此资源',
    });
  }

  return next({
    ctx: {
      // 确保 session 和 user 非空
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

/**
 * 管理员权限中间件
 * 检查用户是否为管理员
 */
const isAdmin = t.middleware(async ({ ctx, next }) => {
  // 首先检查用户是否已登录
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '您需要登录才能访问此资源',
    });
  }

  // 检查用户角色是否为管理员
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: '您没有足够的权限访问此资源',
    });
  }

  return next({
    ctx: {
      // 确保 session 和 user 非空，且用户为管理员
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

/**
 * 4. 可复用的 Procedure 和 Router
 * 从 t 中导出便于后续创建路由和 procedure
 */

/**
 * 创建 tRPC 路由器
 * 用于组合多个 procedure 成为一个路由
 */
export const createTRPCRouter = t.router;

/**
 * 公共 procedure
 * 这是基础的 procedure，任何人都可以调用
 */
export const publicProcedure = t.procedure;

/**
 * 受保护的 procedure
 * 仅限已登录用户访问
 */
export const protectedProcedure = t.procedure.use(isAuthed);

/**
 * 管理员 procedure
 * 仅限角色为 "admin" 的已登录用户访问
 */
export const adminProcedure = t.procedure.use(isAdmin); 