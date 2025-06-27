import { z } from 'zod';
import { hash } from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';

/**
 * 用户注册验证架构
 */
const registerSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8位字符').max(100, '密码不能超过100个字符'),
});

/**
 * 认证路由器
 * 包含注册、登录等公开访问的认证功能
 */
export const authRouter = createTRPCRouter({
  /**
   * 用户注册
   * 公开访问，无需认证
   */
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, email, password } = input;

        // 检查邮箱是否已存在
        const existingUser = await ctx.db.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '该邮箱已被注册',
          });
        }

        // 密码加密
        const hashedPassword = await hash(password, 12);

        // 创建用户
        const user = await ctx.db.user.create({
          data: {
            name,
            email: email.toLowerCase(),
            hashedPassword,
            role: 'user', // 默认角色
            status: 'ACTIVE',
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

        console.log(`新用户注册成功: ${user.email}`);

        return {
          message: '注册成功',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      } catch (error) {
        console.error('注册过程中发生错误:', error);

        // 如果是已知的 TRPCError，直接抛出
        if (error instanceof TRPCError) {
          throw error;
        }

        // 处理数据库约束错误
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '该邮箱已被注册',
          });
        }

        // 其他未知错误
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '注册失败，请稍后重试',
        });
      }
    }),
}); 