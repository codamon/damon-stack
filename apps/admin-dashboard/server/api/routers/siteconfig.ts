import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

// SiteConfig 验证 schema
const siteConfigSchema = z.object({
  // 基础信息
  siteName: z.string().min(1, '网站名称不能为空').max(100, '网站名称不能超过100个字符'),
  siteUrl: z.string().url('请输入有效的网站URL'),
  description: z.string().optional(),
  logo: z.string().url().optional().or(z.literal('')),
  favicon: z.string().url().optional().or(z.literal('')),
  
  // SEO设置
  defaultTitle: z.string().optional(),
  defaultDescription: z.string().optional(),
  
  // 社交媒体
  facebook: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  
  // 联系信息
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  
  // 首页配置
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().url().optional().or(z.literal('')),
  heroButtonText: z.string().optional(),
  heroButtonLink: z.string().optional(),
  
  // 功能开关
  enableComments: z.boolean().default(true),
  enableNewsletter: z.boolean().default(false),
  enableSearch: z.boolean().default(true),
  
  // 分析和统计
  googleAnalyticsId: z.string().optional(),
  baiduAnalyticsId: z.string().optional(),
});

const updateSiteConfigSchema = siteConfigSchema.partial().extend({
  id: z.string()
});

export const siteConfigRouter = createTRPCRouter({
  // 获取网站配置（管理员）
  get: adminProcedure
    .query(async ({ ctx }) => {
      // 获取第一个配置记录，通常只有一个全局配置
      const config = await ctx.db.siteConfig.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (!config) {
        // 如果没有配置，返回默认配置
        return {
          id: '',
          siteName: '',
          siteUrl: '',
          description: null,
          logo: null,
          favicon: null,
          defaultTitle: null,
          defaultDescription: null,
          facebook: null,
          twitter: null,
          linkedin: null,
          instagram: null,
          youtube: null,
          email: null,
          phone: null,
          address: null,
          heroTitle: null,
          heroSubtitle: null,
          heroImage: null,
          heroButtonText: null,
          heroButtonLink: null,
          enableComments: true,
          enableNewsletter: false,
          enableSearch: true,
          googleAnalyticsId: null,
          baiduAnalyticsId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      return config;
    }),

  // 创建或更新网站配置
  upsert: adminProcedure
    .input(siteConfigSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 检查是否已存在配置
        const existingConfig = await ctx.db.siteConfig.findFirst();

        if (existingConfig) {
          // 更新现有配置
          return await ctx.db.siteConfig.update({
            where: { id: existingConfig.id },
            data: input
          });
        } else {
          // 创建新配置
          return await ctx.db.siteConfig.create({
            data: input
          });
        }
      } catch (error) {
        console.error('保存网站配置失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '保存网站配置失败，请稍后重试',
        });
      }
    }),

  // 删除网站配置
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.siteConfig.delete({
          where: { id: input.id }
        });

        return { success: true };
      } catch (error) {
        console.error('删除网站配置失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除网站配置失败，请稍后重试',
        });
      }
    }),

  // ============================================
  // 公共 API - 前端获取网站配置（无需认证）
  // ============================================

  // 获取公开的网站配置
  getPublic: publicProcedure
    .query(async ({ ctx }) => {
      const config = await ctx.db.siteConfig.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          // 只返回前端需要的公开字段
          siteName: true,
          siteUrl: true,
          description: true,
          logo: true,
          favicon: true,
          defaultTitle: true,
          defaultDescription: true,
          facebook: true,
          twitter: true,
          linkedin: true,
          instagram: true,
          youtube: true,
          email: true,
          phone: true,
          address: true,
          heroTitle: true,
          heroSubtitle: true,
          heroImage: true,
          heroButtonText: true,
          heroButtonLink: true,
          enableComments: true,
          enableNewsletter: true,
          enableSearch: true,
          // 不返回分析ID等敏感信息
        }
      });

      // 如果没有配置，返回默认值
      if (!config) {
        return {
          siteName: 'Damon Stack',
          siteUrl: 'https://damon-stack.com',
          description: '现代化全栈开发技术分享',
          logo: null,
          favicon: null,
          defaultTitle: 'Damon Stack - 现代化全栈开发',
          defaultDescription: '分享现代化全栈开发技术、最佳实践和项目经验',
          facebook: null,
          twitter: null,
          linkedin: null,
          instagram: null,
          youtube: null,
          email: 'contact@damon-stack.com',
          phone: null,
          address: null,
          heroTitle: '现代化全栈开发',
          heroSubtitle: '分享技术、传递价值、创造未来',
          heroImage: null,
          heroButtonText: '开始阅读',
          heroButtonLink: '/posts',
          enableComments: true,
          enableNewsletter: false,
          enableSearch: true,
        };
      }

      return config;
    }),
});

export type SiteConfigRouter = typeof siteConfigRouter; 