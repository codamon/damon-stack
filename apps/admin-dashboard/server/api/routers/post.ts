import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';
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
      slug: z.string().optional(), // 允许前端传递slug，但会被重新生成
      content: z.string().min(1, '内容不能为空'),
      excerpt: z.string().optional(),
      coverImage: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
        message: '封面图片必须是有效的URL'
      }),
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
      const { tagIds, slug: inputSlug, ...postData } = input;
      
      // 生成唯一的 slug（忽略前端传递的slug）
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
      
      // 处理coverImage字段
      const processedCoverImage = postData.coverImage === '' ? null : postData.coverImage;
      
      // 自动设置发布时间
      const finalData = {
        ...postData,
        coverImage: processedCoverImage,
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

  // ============================================
  // 公共 API - 博客前端专用（无需认证）
  // ============================================

  // 获取已发布文章列表（公开访问）
  getPublished: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(20).default(10),
      search: z.string().optional(),
      categoryId: z.string().optional(),
      featured: z.boolean().optional(),
      sortBy: z.enum(['publishedAt', 'viewCount', 'title']).default('publishedAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ input, ctx }): Promise<PaginatedResult<PostWithRelations>> => {
      const { page, pageSize, search, categoryId, featured, sortBy, sortOrder } = input;
      const skip = (page - 1) * pageSize;

      // 构建查询条件 - 只返回已发布的文章
      const where: any = { 
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() } // 确保发布时间不是未来
      };
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (categoryId) {
        where.categoryId = categoryId;
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

  // 根据 slug 获取已发布文章（公开访问）
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input, ctx }): Promise<PostWithRelations> => {
      const post = await ctx.db.post.findFirst({
        where: { 
          slug: input.slug,
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
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

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '文章不存在或尚未发布',
        });
      }

      // 增加浏览次数
      await ctx.db.post.update({
        where: { id: post.id },
        data: {
          viewCount: {
            increment: 1
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

  // 获取热门文章（公开访问）
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(10).default(5),
      days: z.number().int().min(1).max(365).default(30), // 最近多少天内的热门文章
    }))
    .query(async ({ input, ctx }): Promise<PostWithRelations[]> => {
      const { limit, days } = input;
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const posts = await ctx.db.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { 
            lte: new Date(),
            gte: dateThreshold
          }
        },
        orderBy: [
          { viewCount: 'desc' },
          { publishedAt: 'desc' }
        ],
        take: limit,
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

      return posts.map((post: any) => ({
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      }));
    }),

  // 获取相关文章（公开访问）
  getRelated: publicProcedure
    .input(z.object({
      postId: z.string(),
      limit: z.number().int().min(1).max(10).default(4),
    }))
    .query(async ({ input, ctx }): Promise<PostWithRelations[]> => {
      const { postId, limit } = input;

      // 先获取当前文章的分类和标签
      const currentPost = await ctx.db.post.findUnique({
        where: { id: postId },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            }
          }
        }
      });

      if (!currentPost) {
        return [];
      }

      const tagIds = currentPost.tags.map(pt => pt.tag.id);

      // 查找相关文章
      const relatedPosts = await ctx.db.post.findMany({
        where: {
          id: { not: postId }, // 排除当前文章
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
          OR: [
            // 同分类
            { categoryId: currentPost.categoryId },
            // 有共同标签
            ...(tagIds.length > 0 ? [{
              tags: {
                some: {
                  tagId: { in: tagIds }
                }
              }
            }] : [])
          ]
        },
        orderBy: [
          { viewCount: 'desc' },
          { publishedAt: 'desc' }
        ],
        take: limit,
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

      return relatedPosts.map((post: any) => ({
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      }));
    }),

  // 获取文章归档（按年月分组）
  getArchive: publicProcedure
    .query(async ({ ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() }
        },
        select: {
          id: true,
          title: true,
          slug: true,
          publishedAt: true,
        },
        orderBy: {
          publishedAt: 'desc'
        }
      });

      // 按年月分组
      const archive: Record<string, Record<string, typeof posts>> = {};
      
      posts.forEach(post => {
        if (!post.publishedAt) return;
        
        const year = post.publishedAt.getFullYear().toString();
        const month = (post.publishedAt.getMonth() + 1).toString().padStart(2, '0');
        
        if (!archive[year]) {
          archive[year] = {};
        }
        
        if (!archive[year][month]) {
          archive[year][month] = [];
        }
        
        archive[year][month].push(post);
      });

      return archive;
    }),

  // ============================================
  // 步骤9新增的前端专用API
  // ============================================

  // 获取精选文章（公开访问）
  getFeatured: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(20).default(6), // 限制数量
      excludeId: z.string().optional(), // 排除指定文章ID
    }))
    .query(async ({ input, ctx }): Promise<PostWithRelations[]> => {
      const { limit, excludeId } = input;

      const posts = await ctx.db.post.findMany({
        where: {
          status: 'PUBLISHED',
          publishedAt: { lte: new Date() },
          featured: true,
          ...(excludeId && { id: { not: excludeId } })
        },
        orderBy: [
          { order: 'desc' }, // 按排序权重
          { publishedAt: 'desc' }, // 再按发布时间
          { viewCount: 'desc' } // 最后按浏览量
        ],
        take: limit,
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

      return posts.map((post: any) => ({
        ...post,
        author: post.author,
        category: post.category,
        tags: post.tags.map((pt: any) => pt.tag),
      }));
    }),

  // 全文搜索文章（公开访问）
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, '搜索关键词不能为空').max(100, '搜索关键词不能超过100个字符'),
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(20).default(8),
      categoryId: z.string().optional(), // 可选：按分类筛选
      sortBy: z.enum(['relevance', 'publishedAt', 'viewCount']).default('relevance'),
    }))
    .query(async ({ input, ctx }): Promise<PaginatedResult<PostWithRelations>> => {
      const { query, page, pageSize, categoryId, sortBy } = input;
      const skip = (page - 1) * pageSize;

      // 构建搜索条件
      const where: any = {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { keywords: { contains: query, mode: 'insensitive' } },
          { metaDescription: { contains: query, mode: 'insensitive' } },
          // 搜索标签
          {
            tags: {
              some: {
                tag: {
                  name: { contains: query, mode: 'insensitive' }
                }
              }
            }
          },
          // 搜索分类
          {
            category: {
              name: { contains: query, mode: 'insensitive' }
            }
          }
        ]
      };

      // 可选的分类筛选
      if (categoryId) {
        where.categoryId = categoryId;
      }

      // 构建排序条件
      let orderBy: any;
      switch (sortBy) {
        case 'publishedAt':
          orderBy = { publishedAt: 'desc' };
          break;
        case 'viewCount':
          orderBy = { viewCount: 'desc' };
          break;
        case 'relevance':
        default:
          // 相关性排序：标题匹配 > 摘要匹配 > 内容匹配 > 其他
          orderBy = [
            { featured: 'desc' }, // 精选文章优先
            { publishedAt: 'desc' } // 然后按发布时间
          ];
          break;
      }

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
});

export type PostRouter = typeof postRouter; 