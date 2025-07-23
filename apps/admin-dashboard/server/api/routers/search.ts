import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// 搜索筛选器Schema
const SearchFiltersSchema = z.object({
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.array(z.date()).length(2).optional(),
  author: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'popularity']).default('relevance'),
});

// 搜索输入Schema
const SearchInputSchema = z.object({
  query: z.string().min(1).max(100),
  filters: SearchFiltersSchema.optional(),
  source: z.enum(['website', 'blog', 'shop']).default('website'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const searchRouter = router({
  /**
   * 全文搜索
   */
  fullText: publicProcedure
    .input(SearchInputSchema)
    .query(async ({ ctx, input }) => {
      const { query, filters, source, page, limit } = input;
      const offset = (page - 1) * limit;
      
      // 记录搜索日志
      const sessionId = ctx.headers?.['x-session-id'] || 'anonymous';
      const userAgent = ctx.headers?.['user-agent'] || '';
      const ip = ctx.headers?.['x-forwarded-for'] || ctx.headers?.['x-real-ip'] || '';
      
      try {
        // 构建搜索条件
        const searchConditions: any = {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              content: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
            {
              excerpt: {
                contains: query,
                mode: 'insensitive' as const,
              },
            },
          ],
          status: 'PUBLISHED',
        };

        // 应用筛选条件
        if (filters?.category) {
          searchConditions.category = {
            slug: filters.category,
          };
        }

        if (filters?.tags && filters.tags.length > 0) {
          searchConditions.tags = {
            some: {
              slug: {
                in: filters.tags,
              },
            },
          };
        }

        if (filters?.dateRange) {
          searchConditions.publishedAt = {
            gte: filters.dateRange[0],
            lte: filters.dateRange[1],
          };
        }

        if (filters?.author) {
          searchConditions.author = {
            name: {
              contains: filters.author,
              mode: 'insensitive' as const,
            },
          };
        }

        // 构建排序条件
        let orderBy: any = {};
        switch (filters?.sortBy) {
          case 'date':
            orderBy = { publishedAt: 'desc' };
            break;
          case 'popularity':
            orderBy = { views: 'desc' };
            break;
          default: // relevance
            // 简单的相关性排序：标题匹配优先，然后按发布时间
            orderBy = { publishedAt: 'desc' };
        }

        // 执行搜索
        const [posts, totalCount] = await Promise.all([
          ctx.db.post.findMany({
            where: searchConditions,
            include: {
              category: true,
              tags: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
            orderBy,
            skip: offset,
            take: limit,
          }),
          ctx.db.post.count({
            where: searchConditions,
          }),
        ]);

        // 记录搜索日志
        await ctx.db.searchLog.create({
          data: {
            query,
            resultsCount: totalCount,
            userId: ctx.session?.user?.id,
            sessionId,
            ip: ip as string,
            userAgent,
            source,
            filters: filters ? JSON.stringify(filters) : null,
          },
        });

        // 更新热门搜索词
        await ctx.db.trendingSearch.upsert({
          where: { query },
          update: {
            searchCount: { increment: 1 },
            lastSearched: new Date(),
          },
          create: {
            query,
            source,
            searchCount: 1,
            lastSearched: new Date(),
          },
        });

        return {
          results: posts,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNextPage: offset + limit < totalCount,
            hasPrevPage: page > 1,
          },
          query,
          filters,
        };
      } catch (error) {
        console.error('搜索错误:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '搜索服务暂时不可用，请稍后重试',
        });
      }
    }),

  /**
   * 获取搜索建议
   */
  suggestions: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(50),
      source: z.enum(['website', 'blog', 'shop']).default('website'),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ ctx, input }) => {
      const { query, source, limit } = input;
      
      try {
        // 获取自定义建议
        const customSuggestions = await ctx.db.searchSuggestion.findMany({
          where: {
            query: {
              contains: query,
              mode: 'insensitive' as const,
            },
            source,
            isActive: true,
          },
          orderBy: { priority: 'desc' },
          take: limit,
        });

        // 获取热门搜索词作为建议
        const trendingSuggestions = await ctx.db.trendingSearch.findMany({
          where: {
            query: {
              contains: query,
              mode: 'insensitive' as const,
            },
            source,
          },
          orderBy: { searchCount: 'desc' },
          take: limit - customSuggestions.length,
        });

        // 获取文章标题作为建议
        const titleSuggestions = await ctx.db.post.findMany({
          where: {
            title: {
              contains: query,
              mode: 'insensitive' as const,
            },
            status: 'PUBLISHED',
          },
          select: {
            title: true,
            slug: true,
          },
          take: limit - customSuggestions.length - trendingSuggestions.length,
        });

        const suggestions = [
          ...customSuggestions.map(s => ({
            text: s.suggestion,
            type: 'custom' as const,
            priority: s.priority,
          })),
          ...trendingSuggestions.map(s => ({
            text: s.query,
            type: 'trending' as const,
            priority: s.searchCount,
          })),
          ...titleSuggestions.map(s => ({
            text: s.title,
            type: 'title' as const,
            priority: 0,
          })),
        ];

        return suggestions.slice(0, limit);
      } catch (error) {
        console.error('获取搜索建议错误:', error);
        return [];
      }
    }),

  /**
   * 获取热门搜索词
   */
  trending: publicProcedure
    .input(z.object({
      source: z.enum(['website', 'blog', 'shop']).default('website'),
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const { source, limit } = input;
      
      try {
        const trending = await ctx.db.trendingSearch.findMany({
          where: { source },
          orderBy: { searchCount: 'desc' },
          take: limit,
        });

        return trending;
      } catch (error) {
        console.error('获取热门搜索词错误:', error);
        return [];
      }
    }),

  /**
   * 记录搜索结果点击
   */
  recordClick: publicProcedure
    .input(z.object({
      query: z.string(),
      resultId: z.string(),
      resultType: z.enum(['post', 'category', 'tag']),
      position: z.number(),
      source: z.enum(['website', 'blog', 'shop']).default('website'),
    }))
    .mutation(async ({ ctx, input }) => {
      const sessionId = ctx.headers?.['x-session-id'] || 'anonymous';
      
      try {
        // 找到最近的搜索记录
        const recentSearch = await ctx.db.searchLog.findFirst({
          where: {
            query: input.query,
            sessionId,
            source: input.source,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (recentSearch) {
          const clickedResults = recentSearch.clickedResults as any[] || [];
          clickedResults.push({
            resultId: input.resultId,
            resultType: input.resultType,
            position: input.position,
            clickedAt: new Date(),
          });

          await ctx.db.searchLog.update({
            where: { id: recentSearch.id },
            data: {
              clickedResults: JSON.stringify(clickedResults),
            },
          });
        }

        return { success: true };
      } catch (error) {
        console.error('记录点击错误:', error);
        return { success: false };
      }
    }),

  /**
   * 获取搜索分析数据 (管理员)
   */
  analytics: protectedProcedure
    .input(z.object({
      source: z.enum(['website', 'blog', 'shop']).optional(),
      dateRange: z.array(z.date()).length(2).optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const { source, dateRange, limit } = input;
      
      // 检查权限
      if (ctx.session.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: '需要管理员权限',
        });
      }

      try {
        const whereCondition: any = {};
        
        if (source) {
          whereCondition.source = source;
        }
        
        if (dateRange) {
          whereCondition.createdAt = {
            gte: dateRange[0],
            lte: dateRange[1],
          };
        }

        // 获取搜索统计
        const [
          totalSearches,
          noResultSearches,
          topQueries,
          searchTrends,
        ] = await Promise.all([
          // 总搜索次数
          ctx.db.searchLog.count({ where: whereCondition }),
          
          // 无结果搜索
          ctx.db.searchLog.count({
            where: {
              ...whereCondition,
              resultsCount: 0,
            },
          }),
          
          // 热门搜索词
          ctx.db.searchLog.groupBy({
            by: ['query'],
            where: whereCondition,
            _count: { query: true },
            _avg: { resultsCount: true },
            orderBy: { _count: { query: 'desc' } },
            take: limit,
          }),
          
          // 搜索趋势 (按天)
          ctx.db.searchLog.groupBy({
            by: ['createdAt'],
            where: whereCondition,
            _count: { id: true },
            orderBy: { createdAt: 'asc' },
          }),
        ]);

        // 计算点击率
        const clickThroughRate = await ctx.db.searchLog.findMany({
          where: {
            ...whereCondition,
            clickedResults: { not: null },
          },
          select: { id: true },
        });

        return {
          totalSearches,
          noResultSearches,
          noResultRate: totalSearches > 0 ? (noResultSearches / totalSearches) * 100 : 0,
          clickThroughRate: totalSearches > 0 ? (clickThroughRate.length / totalSearches) * 100 : 0,
          topQueries: topQueries.map(q => ({
            query: q.query,
            count: q._count.query,
            averageResults: q._avg.resultsCount || 0,
          })),
          searchTrends,
        };
      } catch (error) {
        console.error('获取搜索分析错误:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '获取搜索分析数据失败',
        });
      }
    }),
}); 