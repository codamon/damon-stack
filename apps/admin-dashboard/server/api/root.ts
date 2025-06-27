/**
 * 根路由文件
 * 这是所有 tRPC 路由的集合点
 */

import { createTRPCRouter, publicProcedure, adminProcedure, protectedProcedure } from './trpc';
import { dashboardRouter } from './routers/dashboard';
import { categoryRouter } from './routers/category';
import { postRouter } from './routers/post';
import { authRouter } from './routers/auth';
import { createUserRouter } from '@damon-stack/feature-user-management/api';

// 创建用户管理路由实例（仅管理员可访问）
const userRouter = createUserRouter({
  createTRPCRouter,
  adminProcedure,
});

/**
 * 主应用路由器
 * 将所有子路由合并到这里
 */
export const appRouter = createTRPCRouter({
  /**
   * 认证相关路由
   * 命名空间: auth
   * 访问方式: trpc.auth.register, etc.
   */
  auth: authRouter,

  /**
   * Dashboard 相关路由
   * 命名空间: dashboard
   * 访问方式: trpc.dashboard.getStats, trpc.dashboard.getUserRegistrationTrend, etc.
   */
  dashboard: dashboardRouter,

  /**
   * Post 相关路由 (CMS 模块)
   * 命名空间: post
   * 访问方式: trpc.post.list, trpc.post.create, trpc.post.update, etc.
   */
  post: postRouter,

  /**
   * User 相关路由
   * 命名空间: user
   * 访问方式: trpc.user.list, trpc.user.create, trpc.user.update, etc.
   */
  user: userRouter,

  /**
   * Category 相关路由 (CMS 模块)
   * 命名空间: category
   * 访问方式: trpc.category.list, trpc.category.create, trpc.category.update, etc.
   */
  category: categoryRouter,
});

/**
 * 导出 AppRouter 类型
 * 这个类型将在客户端用于类型安全的 API 调用
 */
export type AppRouter = typeof appRouter; 