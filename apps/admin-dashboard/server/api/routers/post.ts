import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter } from '../trpc';
import type { 
  PostWithRelations, 
  CreatePostInput, 
  UpdatePostInput, 
  PostListParams,
  PaginatedResult,
  PostStatus
} from '../../types/post';

// 生成 URL 友好的 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 检查 slug 是否唯一
async function ensureUniqueSlug(slug: string, ctx: any, excludeId?: string): Promise<string> {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await ctx.db.post.findFirst({
      where: {
        slug: uniqueSlug,
        ...(excludeId && { id: { not: excludeId } })
      }
    });
    
    if (!existing) {
      return uniqueSlug;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
}

// Post 路由器
export const postRouter = createTRPCRouter({
  // 获取文章列表（带分页和筛选）
  list: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(100).default(10),
      search: z.string().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
      categoryId: z.string().optional(),
      authorId: z.string().optional(),
      featured: z.boolean().optional(),
      sortBy: z.enum(['createdAt', 'updatedAt', 'publishedAt', 'title', 'viewCount']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ input, ctx }): Promise<PaginatedResult<PostWithRelations>> => {
      const { page, pageSize, search, status, categoryId, authorId, featured, sortBy, sortOrder } = input;
      const skip = (page - 1) * pageSize;

      // 构建查询条件
      const where: any = {};
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (status) {
        where.status = status;
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
      }
      
      if (authorId) {
        where.authorId = authorId;
      }
      
      if (featured !== undefined) {
        where.featured = featured;
      }

      // 构建排序条件
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;

      // 执行查询
      const [posts, total] = await Promise.all([
        ctx.db.post.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            category: true,
            tags: {
              include: {
                tag: true,
              }
            }
          }
        }),
        ctx.db.post.count({ where })
      ]);

      // 转换数据格式
      const formattedPosts: PostWithRelations[] = posts.map((post: any) => ({
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      }));

      return {
        data: formattedPosts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  // 根据 ID 获取单篇文章
  getById: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }): Promise<PostWithRelations> => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true,
            }
          }
        }
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在',
        });
      }

      return {
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      };
    }),

  // 创建新文章
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1, '标题不能为空'),
      content: z.string().min(1, '内容不能为空'),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional().or(z.literal('')),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).default('DRAFT'),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      featured: z.boolean().default(false),
      publishedAt: z.date().optional(),
      scheduledAt: z.date().optional(),
      authorId: z.string(),
      categoryId: z.string().optional(),
      tagIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<PostWithRelations> => {
      const { tagIds, ...postData } = input;
      
      // 生成唯一的 slug
      const baseSlug = generateSlug(postData.title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, ctx);
      
      // 验证作者是否存在
      const author = await ctx.db.user.findUnique({
        where: { id: postData.authorId }
      });
      
      if (!author) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '指定的作者不存在',
        });
      }
      
      // 验证分类是否存在（如果提供了）
      if (postData.categoryId) {
        const category = await ctx.db.category.findUnique({
          where: { id: postData.categoryId }
        });
        
        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定的分类不存在',
          });
        }
      }
      
      // 自动设置发布时间
      const finalData = {
        ...postData,
        slug: uniqueSlug,
        publishedAt: postData.status === 'PUBLISHED' && !postData.publishedAt 
          ? new Date() 
          : postData.publishedAt,
      };

      // 创建文章
      const post = await ctx.db.post.create({
        data: {
          ...finalData,
          // 如果有标签，创建关联
          ...(tagIds && tagIds.length > 0 && {
            tags: {
              create: tagIds.map(tagId => ({
                tagId,
              }))
            }
          })
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true,
            }
          }
        }
      });

      return {
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      };
    }),

  // 更新文章
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1, '标题不能为空').optional(),
      content: z.string().min(1, '内容不能为空').optional(),
      excerpt: z.string().optional(),
      coverImage: z.string().url().optional().or(z.literal('')),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.string().optional(),
      featured: z.boolean().optional(),
      publishedAt: z.date().optional(),
      scheduledAt: z.date().optional(),
      authorId: z.string().optional(),
      categoryId: z.string().optional(),
      tagIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }): Promise<PostWithRelations> => {
      const { id, tagIds, ...updateData } = input;
      
      // 检查文章是否存在
      const existingPost = await ctx.db.post.findUnique({
        where: { id }
      });
      
      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在',
        });
      }
      
      // 如果更新了标题，重新生成 slug
      let finalUpdateData: any = { ...updateData };
      if (updateData.title && updateData.title !== existingPost.title) {
        const baseSlug = generateSlug(updateData.title);
        const uniqueSlug = await ensureUniqueSlug(baseSlug, ctx, id);
        finalUpdateData.slug = uniqueSlug;
      }
      
      // 如果状态变为已发布且没有发布时间，设置发布时间
      if (updateData.status === 'PUBLISHED' && !existingPost.publishedAt && !updateData.publishedAt) {
        finalUpdateData.publishedAt = new Date();
      }
      
      // 验证作者是否存在（如果更新了）
      if (updateData.authorId) {
        const author = await ctx.db.user.findUnique({
          where: { id: updateData.authorId }
        });
        
        if (!author) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定的作者不存在',
          });
        }
      }
      
      // 验证分类是否存在（如果更新了）
      if (updateData.categoryId) {
        const category = await ctx.db.category.findUnique({
          where: { id: updateData.categoryId }
        });
        
        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '指定的分类不存在',
          });
        }
      }
      
      // 更新文章（包括标签关联）
      const post = await ctx.db.post.update({
        where: { id },
        data: {
          ...finalUpdateData,
          // 如果提供了标签，更新标签关联
          ...(tagIds !== undefined && {
            tags: {
              deleteMany: {}, // 删除所有现有标签关联
              create: tagIds.map(tagId => ({
                tagId,
              }))
            }
          })
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true,
            }
          }
        }
      });

      return {
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      };
    }),

  // 删除文章
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<{ success: boolean }> => {
      // 检查文章是否存在
      const existingPost = await ctx.db.post.findUnique({
        where: { id: input.id }
      });
      
      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在',
        });
      }
      
      // 删除文章（标签关联会被自动删除）
      await ctx.db.post.delete({
        where: { id: input.id }
      });
      
      return { success: true };
    }),

  // 批量删除文章
  batchDelete: adminProcedure
    .input(z.object({
      ids: z.array(z.string()).min(1, '请选择要删除的文章'),
    }))
    .mutation(async ({ input, ctx }): Promise<{ success: boolean; count: number }> => {
      const result = await ctx.db.post.deleteMany({
        where: {
          id: {
            in: input.ids
          }
        }
      });
      
      return { 
        success: true, 
        count: result.count 
      };
    }),

  // 更新文章状态
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED']),
    }))
    .mutation(async ({ input, ctx }): Promise<PostWithRelations> => {
      const updateData: any = { status: input.status };
      
      // 如果状态变为已发布，设置发布时间
      if (input.status === 'PUBLISHED') {
        const existingPost = await ctx.db.post.findUnique({
          where: { id: input.id }
        });
        
        if (existingPost && !existingPost.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
      
      const post = await ctx.db.post.update({
        where: { id: input.id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          category: true,
          tags: {
            include: {
              tag: true,
            }
          }
        }
      });

      return {
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      };
    }),

  // 增加浏览次数
  incrementViewCount: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }): Promise<{ success: boolean }> => {
      await ctx.db.post.update({
        where: { id: input.id },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
      
      return { success: true };
    }),
});

export type PostRouter = typeof postRouter; 