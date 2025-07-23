import { z } from 'zod';
import { hash, compare } from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { randomBytes } from 'crypto';

/**
 * 前端用户注册验证架构
 */
const customerRegisterSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8位字符').max(100, '密码不能超过100个字符'),
  newsletter: z.boolean().optional().default(false),
});

/**
 * 用户登录验证架构
 */
const customerLoginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

/**
 * 用户资料更新架构
 */
const customerUpdateSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符').optional(),
  phone: z.string().optional(),
  birthday: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  newsletter: z.boolean().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
});

/**
 * 密码重置请求架构
 */
const passwordResetRequestSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

/**
 * 密码重置确认架构
 */
const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, '请提供重置令牌'),
  password: z.string().min(8, '密码至少需要8位字符').max(100, '密码不能超过100个字符'),
});

/**
 * 前端用户路由器
 * 包含前端用户的注册、登录、个人资料管理等功能
 */
export const customerRouter = createTRPCRouter({
  /**
   * 前端用户注册
   * 公开访问，无需认证
   */
  register: publicProcedure
    .input(customerRegisterSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, email, password, newsletter } = input;

        // 检查邮箱是否已存在
        const existingCustomer = await ctx.db.customer.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingCustomer) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '该邮箱已被注册',
          });
        }

        // 密码加密
        const hashedPassword = await hash(password, 12);

        // 创建前端用户
        const customer = await ctx.db.customer.create({
          data: {
            name,
            email: email.toLowerCase(),
            hashedPassword,
            newsletter,
            status: 'ACTIVE',
          },
          select: {
            id: true,
            name: true,
            email: true,
            newsletter: true,
            status: true,
            createdAt: true,
          },
        });

        // 记录用户注册行为
        await ctx.db.customerActivity.create({
          data: {
            customerId: customer.id,
            action: 'register',
            page: '/auth/signup',
            ipAddress: ctx.ip,
            userAgent: ctx.userAgent,
          },
        });

        console.log(`新前端用户注册成功: ${customer.email}`);

        return {
          message: '注册成功',
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            newsletter: customer.newsletter,
          },
        };
      } catch (error) {
        console.error('用户注册过程中发生错误:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: '该邮箱已被注册',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '注册失败，请稍后重试',
        });
      }
    }),

  /**
   * 用户登录验证
   * 返回用户信息用于认证
   */
  login: publicProcedure
    .input(customerLoginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { email, password } = input;

        // 查找用户
        const customer = await ctx.db.customer.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            hashedPassword: true,
            status: true,
            loginCount: true,
            lastLoginAt: true,
          },
        });

        if (!customer) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '邮箱或密码错误',
          });
        }

        // 检查账户状态
        if (customer.status !== 'ACTIVE') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: '账户已被禁用或未激活',
          });
        }

        // 验证密码
        if (!customer.hashedPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '请使用社交账号登录',
          });
        }

        const isValidPassword = await compare(password, customer.hashedPassword);
        if (!isValidPassword) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: '邮箱或密码错误',
          });
        }

        // 更新登录统计
        await ctx.db.customer.update({
          where: { id: customer.id },
          data: {
            loginCount: customer.loginCount + 1,
            lastLoginAt: new Date(),
            lastLoginIp: ctx.ip,
          },
        });

        // 记录登录行为
        await ctx.db.customerActivity.create({
          data: {
            customerId: customer.id,
            action: 'login',
            page: '/auth/signin',
            ipAddress: ctx.ip,
            userAgent: ctx.userAgent,
          },
        });

        return {
          message: '登录成功',
          customer: {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            status: customer.status,
          },
        };
      } catch (error) {
        console.error('用户登录过程中发生错误:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '登录失败，请稍后重试',
        });
      }
    }),

  /**
   * 获取当前用户信息
   * 需要认证
   */
  me: publicProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ input, ctx }) => {
      const customer = await ctx.db.customer.findUnique({
        where: { id: input.customerId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          phone: true,
          birthday: true,
          gender: true,
          status: true,
          newsletter: true,
          language: true,
          timezone: true,
          theme: true,
          loginCount: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!customer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '用户不存在',
        });
      }

      return customer;
    }),

  /**
   * 更新用户资料
   */
  updateProfile: publicProcedure
    .input(z.object({
      customerId: z.string(),
      data: customerUpdateSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const customer = await ctx.db.customer.update({
          where: { id: input.customerId },
          data: input.data,
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            birthday: true,
            gender: true,
            newsletter: true,
            language: true,
            timezone: true,
            theme: true,
            updatedAt: true,
          },
        });

        // 记录资料更新行为
        await ctx.db.customerActivity.create({
          data: {
            customerId: input.customerId,
            action: 'update_profile',
            details: input.data,
            ipAddress: ctx.ip,
            userAgent: ctx.userAgent,
          },
        });

        return {
          message: '资料更新成功',
          customer,
        };
      } catch (error) {
        console.error('更新用户资料过程中发生错误:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '用户不存在',
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新失败，请稍后重试',
        });
      }
    }),

  /**
   * 请求密码重置
   */
  requestPasswordReset: publicProcedure
    .input(passwordResetRequestSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { email } = input;

        // 查找用户
        const customer = await ctx.db.customer.findUnique({
          where: { email: email.toLowerCase() },
          select: { id: true, name: true, email: true },
        });

        if (!customer) {
          // 为了安全，即使用户不存在也返回成功
          return {
            message: '如果该邮箱已注册，重置链接将发送到您的邮箱',
          };
        }

        // 生成重置令牌
        const resetToken = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1小时后过期

        // 保存重置令牌
        await ctx.db.customerVerificationToken.create({
          data: {
            customerId: customer.id,
            identifier: customer.email,
            token: resetToken,
            type: 'password_reset',
            expires: expiresAt,
          },
        });

        // 记录密码重置请求行为
        await ctx.db.customerActivity.create({
          data: {
            customerId: customer.id,
            action: 'password_reset_request',
            ipAddress: ctx.ip,
            userAgent: ctx.userAgent,
          },
        });

        // TODO: 发送重置邮件
        console.log(`密码重置令牌: ${resetToken} (用户: ${customer.email})`);

        return {
          message: '如果该邮箱已注册，重置链接将发送到您的邮箱',
        };
      } catch (error) {
        console.error('密码重置请求过程中发生错误:', error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '请求失败，请稍后重试',
        });
      }
    }),

  /**
   * 确认密码重置
   */
  confirmPasswordReset: publicProcedure
    .input(passwordResetConfirmSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { token, password } = input;

        // 查找有效的重置令牌
        const verificationToken = await ctx.db.customerVerificationToken.findFirst({
          where: {
            token,
            type: 'password_reset',
            used: false,
            expires: { gt: new Date() },
          },
        });

        if (!verificationToken) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '重置链接无效或已过期',
          });
        }

        // 加密新密码
        const hashedPassword = await hash(password, 12);

        // 更新用户密码
        await ctx.db.customer.update({
          where: { id: verificationToken.customerId! },
          data: { hashedPassword },
        });

        // 标记令牌为已使用
        await ctx.db.customerVerificationToken.update({
          where: { id: verificationToken.id },
          data: { used: true },
        });

        // 记录密码重置行为
        await ctx.db.customerActivity.create({
          data: {
            customerId: verificationToken.customerId!,
            action: 'password_reset_confirm',
            ipAddress: ctx.ip,
            userAgent: ctx.userAgent,
          },
        });

        return {
          message: '密码重置成功，请使用新密码登录',
        };
      } catch (error) {
        console.error('密码重置确认过程中发生错误:', error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '重置失败，请稍后重试',
        });
      }
    }),

  /**
   * 获取用户活动记录
   */
  getActivities: publicProcedure
    .input(z.object({
      customerId: z.string(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const activities = await ctx.db.customerActivity.findMany({
        where: { customerId: input.customerId },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
        skip: input.offset,
        select: {
          id: true,
          action: true,
          page: true,
          ipAddress: true,
          createdAt: true,
        },
      });

      const total = await ctx.db.customerActivity.count({
        where: { customerId: input.customerId },
      });

      return {
        activities,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  /**
   * 管理员功能：获取所有前端用户列表
   * 需要管理员权限
   */
  list: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      search: z.string().optional(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { page, limit, search, status } = input;
      const offset = (page - 1) * limit;

      // 构建查询条件
      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (status) {
        where.status = status;
      }

      const [customers, total] = await Promise.all([
        ctx.db.customer.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            status: true,
            loginCount: true,
            lastLoginAt: true,
            createdAt: true,
          },
        }),
        ctx.db.customer.count({ where }),
      ]);

      return {
        customers,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: offset + limit < total,
      };
    }),

  /**
   * 管理员功能：更新用户状态
   */
  updateStatus: protectedProcedure
    .input(z.object({
      customerId: z.string(),
      status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']),
    }))
    .mutation(async ({ input, ctx }) => {
      const customer = await ctx.db.customer.update({
        where: { id: input.customerId },
        data: { status: input.status },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      });

      return {
        message: '用户状态更新成功',
        customer,
      };
    }),
}); 