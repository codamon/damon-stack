import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { db as prisma } from "@damon-stack/db";

// Category 验证 schema
const createCategorySchema = z.object({
  name: z.string().min(1, "分类名称不能为空").max(255, "分类名称不能超过255个字符"),
  slug: z.string().min(1, "分类标识不能为空").max(255, "分类标识不能超过255个字符"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  order: z.number().int().min(0).default(0),
});

const updateCategorySchema = createCategorySchema.partial();

const categoryIdSchema = z.object({
  id: z.string(),
});

// 生成 URL 友好的 slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 将空格和下划线转换为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
}

// 递归收集所有子分类ID
function collectChildIds(category: any, excludedIds: Set<string>) {
  if (category.children) {
    category.children.forEach((child: any) => {
      excludedIds.add(child.id);
      collectChildIds(child, excludedIds);
    });
  }
}

export const categoryRouter = createTRPCRouter({
  // 获取所有分类
  list: adminProcedure
    .input(
      z.object({
        parentId: z.string().optional(),
        includeChildren: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ input = {} }) => {
      const { parentId, includeChildren } = input;
      
      return await prisma.category.findMany({
        where: parentId !== undefined ? { parentId } : {},
        include: {
          parent: true,
          children: includeChildren,
          _count: {
            select: {
              children: true,
            },
          },
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });
    }),

  // 获取树形结构的分类
  tree: adminProcedure
    .query(async () => {
      const buildTree = (categories: any[], parentId: string | null = null): any[] => {
        return categories
          .filter(cat => cat.parentId === parentId)
          .map(cat => ({
            ...cat,
            children: buildTree(categories, cat.id),
          }));
      };

      const allCategories = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return buildTree(allCategories);
    }),

  // 根据 ID 获取单个分类
  byId: adminProcedure
    .input(categoryIdSchema)
    .query(async ({ input }) => {
      const category = await prisma.category.findUnique({
        where: { id: input.id },
        include: {
          parent: true,
          children: {
            orderBy: [
              { order: "asc" },
              { createdAt: "desc" },
            ],
          },
        },
      });

      if (!category) {
        throw new Error("分类不存在");
      }

      return category;
    }),

  // 生成分类slug
  generateSlug: adminProcedure
    .input(z.object({
      name: z.string().min(1, '分类名称不能为空'),
    }))
    .query(async ({ input }) => {
      const slug = generateSlug(input.name);
      return { slug };
    }),

  // 获取父分类选项（排除自己和子分类）
  getParentOptions: adminProcedure
    .input(z.object({
      excludeId: z.string().optional(), // 编辑时传入当前分类ID
    }))
    .query(async ({ input, ctx }) => {
      // 获取所有分类
      const allCategories = await ctx.db.category.findMany({
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true, // 支持更深层级
                }
              }
            }
          }
        }
      });

      // 如果没有排除ID，返回所有分类
      if (!input.excludeId) {
        return allCategories.map(cat => ({
          value: cat.id,
          label: cat.name,
        }));
      }

      // 找到要排除的分类
      const excludeCategory = allCategories.find(cat => cat.id === input.excludeId);
      if (!excludeCategory) {
        return allCategories.map(cat => ({
          value: cat.id,
          label: cat.name,
        }));
      }

      // 收集要排除的ID（自己和所有子分类）
      const excludedIds = new Set([input.excludeId]);
      collectChildIds(excludeCategory, excludedIds);

      // 过滤掉排除的分类
      return allCategories
        .filter(cat => !excludedIds.has(cat.id))
        .map(cat => ({
          value: cat.id,
          label: cat.name,
        }));
    }),

  // 创建新分类
  create: adminProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }) => {
      // 检查 slug 是否已存在
      const existingCategory = await prisma.category.findUnique({
        where: { slug: input.slug },
      });

      if (existingCategory) {
        throw new Error("分类标识已存在");
      }

      // 如果指定了父分类，检查父分类是否存在
      if (input.parentId) {
        const parentCategory = await prisma.category.findUnique({
          where: { id: input.parentId },
        });

        if (!parentCategory) {
          throw new Error("父分类不存在");
        }
      }

      return await prisma.category.create({
        data: input,
        include: {
          parent: true,
          children: true,
        },
      });
    }),

  // 更新分类
  update: adminProcedure
    .input(categoryIdSchema.merge(updateCategorySchema))
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      // 检查分类是否存在
      const existingCategory = await prisma.category.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error("分类不存在");
      }

      // 如果要更新 slug，检查新 slug 是否已被其他分类使用
      if (updateData.slug && updateData.slug !== existingCategory.slug) {
        const slugExists = await prisma.category.findUnique({
          where: { slug: updateData.slug },
        });

        if (slugExists) {
          throw new Error("分类标识已存在");
        }
      }

      // 如果要更新 parentId，检查是否会形成循环引用
      if (updateData.parentId) {
        if (updateData.parentId === id) {
          throw new Error("不能将分类设置为自己的父分类");
        }

        // 检查父分类是否存在
        const parentCategory = await prisma.category.findUnique({
          where: { id: updateData.parentId },
        });

        if (!parentCategory) {
          throw new Error("父分类不存在");
        }

        // 简单的循环检查（防止将父分类设置为子分类）
        const isDescendant = async (categoryId: string, ancestorId: string): Promise<boolean> => {
          const category = await prisma.category.findUnique({
            where: { id: categoryId },
          });

          if (!category || !category.parentId) return false;
          if (category.parentId === ancestorId) return true;

          return await isDescendant(category.parentId, ancestorId);
        };

        if (await isDescendant(updateData.parentId, id)) {
          throw new Error("不能将子分类设置为父分类");
        }
      }

      return await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          parent: true,
          children: true,
        },
      });
    }),

  // 删除分类
  delete: adminProcedure
    .input(categoryIdSchema)
    .mutation(async ({ input }) => {
      // 检查分类是否存在
      const category = await prisma.category.findUnique({
        where: { id: input.id },
        include: {
          children: true,
        },
      });

      if (!category) {
        throw new Error("分类不存在");
      }

      // 检查是否有子分类
      if (category.children.length > 0) {
        throw new Error("该分类下还有子分类，无法删除");
      }

      await prisma.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // 批量删除分类
  batchDelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1, "请至少选择一个分类"),
      })
    )
    .mutation(async ({ input }) => {
      // 检查所有分类是否都存在且没有子分类
      for (const id of input.ids) {
        const category = await prisma.category.findUnique({
          where: { id },
          include: {
            children: true,
          },
        });

        if (!category) {
          throw new Error(`分类 ${id} 不存在`);
        }

        if (category.children.length > 0) {
          throw new Error(`分类 "${category.name}" 下还有子分类，无法删除`);
        }
      }

      // 批量删除
      await prisma.category.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      return { success: true, deletedCount: input.ids.length };
    }),

  // 更新分类排序
  updateOrder: adminProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.string(),
            order: z.number().int().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // 批量更新排序
      const updatePromises = input.updates.map(({ id, order }) =>
        prisma.category.update({
          where: { id },
          data: { order },
        })
      );

      await Promise.all(updatePromises);

      return { success: true };
    }),
}); 