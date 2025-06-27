/**
 * User Management tRPC Routes
 * 用户管理tRPC路由定义
 * 
 * 🔒 权限控制：所有用户管理操作仅限管理员访问
 */

import { z } from 'zod';
import {
  userCreateSchema,
  userUpdateSchema,
  userListSchema,
  type User,
  type UserListResponse,
  type UserStatsResponse,
} from './types';

/**
 * 创建用户管理路由
 * 需要传入 tRPC 相关函数作为依赖
 * 
 * 🔒 安全说明：所有路由使用 adminProcedure，仅管理员可访问
 */
export function createUserRouter(deps: {
  createTRPCRouter: any;
  adminProcedure: any; // 更改为 adminProcedure
}) {
  const { createTRPCRouter, adminProcedure } = deps;

  // 定义上下文类型（包含认证信息）
  type Context = {
    db: any; // 应该是 PrismaClient 类型，但这里简化为 any
    session: any; // NextAuth session
    user: any; // 当前用户信息（已验证为管理员）
  };

  return createTRPCRouter({
    /**
     * 获取用户列表
     * 支持游标分页和搜索
     * 🔒 权限：仅管理员
     */
    list: adminProcedure
      .input(userListSchema)
      .query(async ({ input, ctx }: { input: z.infer<typeof userListSchema>; ctx: Context }): Promise<UserListResponse> => {
        const { limit, cursor, search, role, status } = input;

        // 构建where条件
        const where: any = {};
        
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ];
        }
        
        if (role) {
          where.role = role;
        }
        
        if (status) {
          where.status = status;
        }

        // 分页查询
        const users = await ctx.db.user.findMany({
          where,
          take: limit + 1, // 多取一条用于判断是否有下一页
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        // 判断是否有下一页
        const hasNextPage = users.length > limit;
        const items = hasNextPage ? users.slice(0, -1) : users;
        const nextCursor = hasNextPage ? items[items.length - 1]?.id : undefined;

        return {
          items: items as User[],
          nextCursor,
          hasNextPage,
        };
      }),

    /**
     * 根据ID获取单个用户
     * 🔒 权限：仅管理员
     */
    getById: adminProcedure
      .input(
        z.object({
          id: z.string().min(1, '用户ID不能为空'),
        })
      )
      .query(async ({ input, ctx }: { input: { id: string }; ctx: Context }): Promise<User> => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) {
          throw new Error(`用户 ${input.id} 不存在`);
        }

        return user as User;
      }),

    /**
     * 创建新用户
     * 🔒 权限：仅管理员
     */
    create: adminProcedure
      .input(userCreateSchema)
      .mutation(async ({ input, ctx }: { input: z.infer<typeof userCreateSchema>; ctx: Context }) => {
        // 检查邮箱是否已存在
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new Error(`邮箱 ${input.email} 已被使用`);
        }

        // 创建用户
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            email: input.email,
            role: input.role,
            status: input.status,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return {
          user: user as User,
          message: '用户创建成功',
        };
      }),

    /**
     * 更新用户信息
     * 🔒 权限：仅管理员
     */
    update: adminProcedure
      .input(userUpdateSchema)
      .mutation(async ({ input, ctx }: { input: z.infer<typeof userUpdateSchema>; ctx: Context }) => {
        const { id, ...updateData } = input;

        // 检查用户是否存在
        const existingUser = await ctx.db.user.findUnique({
          where: { id },
        });

        if (!existingUser) {
          throw new Error(`用户 ${id} 不存在`);
        }

        // 如果更新邮箱，检查邮箱是否已被其他用户使用
        if (updateData.email) {
          const emailUser = await ctx.db.user.findUnique({
            where: { email: updateData.email },
          });

          if (emailUser && emailUser.id !== id) {
            throw new Error(`邮箱 ${updateData.email} 已被其他用户使用`);
          }
        }

        // 更新用户
        const user = await ctx.db.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return {
          user: user as User,
          message: '用户更新成功',
        };
      }),

    /**
     * 删除用户
     * 🔒 权限：仅管理员
     */
    delete: adminProcedure
      .input(
        z.object({
          id: z.string().min(1, '用户ID不能为空'),
        })
      )
      .mutation(async ({ input, ctx }: { input: { id: string }; ctx: Context }) => {
        // 检查用户是否存在
        const existingUser = await ctx.db.user.findUnique({
          where: { id: input.id },
        });

        if (!existingUser) {
          throw new Error(`用户 ${input.id} 不存在`);
        }

        // 防止管理员删除自己
        if (input.id === ctx.user.id) {
          throw new Error('不能删除自己的账户');
        }

        // 删除用户
        await ctx.db.user.delete({
          where: { id: input.id },
        });

        return {
          message: '用户删除成功',
        };
      }),

    /**
     * 批量删除用户
     * 🔒 权限：仅管理员
     */
    deleteMany: adminProcedure
      .input(
        z.object({
          ids: z.array(z.string()).min(1, '至少选择一个用户'),
        })
      )
      .mutation(async ({ input, ctx }: { input: { ids: string[] }; ctx: Context }) => {
        // 防止管理员删除自己
        if (input.ids.includes(ctx.user.id)) {
          throw new Error('不能删除自己的账户');
        }

        const { count } = await ctx.db.user.deleteMany({
          where: {
            id: {
              in: input.ids,
            },
          },
        });

        return {
          count,
          message: `成功删除 ${count} 个用户`,
        };
      }),

    /**
     * 获取用户统计信息
     * 🔒 权限：仅管理员
     */
    getStats: adminProcedure
      .query(async ({ ctx }: { ctx: Context }): Promise<UserStatsResponse> => {
        const [
          totalUsers,
          activeUsers,
          bannedUsers,
          adminUsers,
          regularUsers,
        ] = await Promise.all([
          ctx.db.user.count(),
          ctx.db.user.count({ where: { status: 'ACTIVE' } }),
          ctx.db.user.count({ where: { status: 'BANNED' } }),
          ctx.db.user.count({ where: { role: 'ADMIN' } }),
          ctx.db.user.count({ where: { role: 'USER' } }),
        ]);

        return {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          admin: adminUsers,
          regular: regularUsers,
        };
      }),
  });
} 