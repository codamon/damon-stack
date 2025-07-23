import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { adminProcedure, createTRPCRouter, publicProcedure } from '../trpc';

// NavigationMenu 验证 schema
const navigationMenuSchema = z.object({
  name: z.string().min(1, '菜单名称不能为空').max(50, '菜单名称不能超过50个字符'),
  url: z.string().min(1, '链接地址不能为空'),
  icon: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  order: z.number().int().min(0).default(0),
  isExternal: z.boolean().default(false),
  isVisible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
  requireAuth: z.boolean().default(false),
  allowedRoles: z.string().optional(),
});

const updateNavigationMenuSchema = navigationMenuSchema.partial().extend({
  id: z.string()
});

// 递归收集所有子菜单ID
function collectChildIds(menu: any, excludedIds: Set<string>) {
  if (menu.children) {
    menu.children.forEach((child: any) => {
      excludedIds.add(child.id);
      collectChildIds(child, excludedIds);
    });
  }
}

export const navigationRouter = createTRPCRouter({
  // 获取所有导航菜单
  list: adminProcedure
    .input(
      z.object({
        parentId: z.string().optional(),
        includeChildren: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ input = {}, ctx }) => {
      const { parentId, includeChildren } = input;
      
      return await ctx.db.navigationMenu.findMany({
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

  // 获取树形结构的导航菜单
  tree: adminProcedure
    .query(async ({ ctx }) => {
      const buildTree = (menus: any[], parentId: string | null = null): any[] => {
        return menus
          .filter(menu => menu.parentId === parentId)
          .map(menu => ({
            ...menu,
            children: buildTree(menus, menu.id),
          }));
      };

      const allMenus = await ctx.db.navigationMenu.findMany({
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

      return buildTree(allMenus);
    }),

  // 根据 ID 获取单个导航菜单
  byId: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const menu = await ctx.db.navigationMenu.findUnique({
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

      if (!menu) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: '导航菜单不存在',
        });
      }

      return menu;
    }),

  // 获取父菜单选项（排除自己和子菜单）
  getParentOptions: adminProcedure
    .input(z.object({
      excludeId: z.string().optional(), // 编辑时传入当前菜单ID
    }))
    .query(async ({ input, ctx }) => {
      // 获取所有菜单
      const allMenus = await ctx.db.navigationMenu.findMany({
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

      // 如果没有排除ID，返回所有菜单
      if (!input.excludeId) {
        return allMenus.map(menu => ({
          value: menu.id,
          label: menu.name,
        }));
      }

      // 找到要排除的菜单
      const excludeMenu = allMenus.find(menu => menu.id === input.excludeId);
      if (!excludeMenu) {
        return allMenus.map(menu => ({
          value: menu.id,
          label: menu.name,
        }));
      }

      // 收集要排除的ID（自己和所有子菜单）
      const excludedIds = new Set([input.excludeId]);
      collectChildIds(excludeMenu, excludedIds);

      // 过滤掉排除的菜单
      return allMenus
        .filter(menu => !excludedIds.has(menu.id))
        .map(menu => ({
          value: menu.id,
          label: menu.name,
        }));
    }),

  // 创建新导航菜单
  create: adminProcedure
    .input(navigationMenuSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // 如果指定了父菜单，检查父菜单是否存在
        if (input.parentId) {
          const parentMenu = await ctx.db.navigationMenu.findUnique({
            where: { id: input.parentId },
          });

          if (!parentMenu) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: '父菜单不存在',
            });
          }
        }

        return await ctx.db.navigationMenu.create({
          data: input,
          include: {
            parent: true,
            children: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('创建导航菜单失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '创建导航菜单失败，请稍后重试',
        });
      }
    }),

  // 更新导航菜单
  update: adminProcedure
    .input(updateNavigationMenuSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      try {
        // 检查菜单是否存在
        const existingMenu = await ctx.db.navigationMenu.findUnique({
          where: { id },
        });

        if (!existingMenu) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '导航菜单不存在',
          });
        }

        // 如果要更新 parentId，检查是否会形成循环引用
        if (updateData.parentId) {
          if (updateData.parentId === id) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '不能将菜单设置为自己的父菜单',
            });
          }

          // 检查父菜单是否存在
          const parentMenu = await ctx.db.navigationMenu.findUnique({
            where: { id: updateData.parentId },
          });

          if (!parentMenu) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: '父菜单不存在',
            });
          }

          // 简单的循环检查（防止将父菜单设置为子菜单）
          const isDescendant = async (menuId: string, ancestorId: string): Promise<boolean> => {
            const menu = await ctx.db.navigationMenu.findUnique({
              where: { id: menuId },
            });

            if (!menu || !menu.parentId) return false;
            if (menu.parentId === ancestorId) return true;

            return await isDescendant(menu.parentId, ancestorId);
          };

          if (await isDescendant(updateData.parentId, id)) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: '不能将子菜单设置为父菜单',
            });
          }
        }

        return await ctx.db.navigationMenu.update({
          where: { id },
          data: updateData,
          include: {
            parent: true,
            children: true,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('更新导航菜单失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新导航菜单失败，请稍后重试',
        });
      }
    }),

  // 删除导航菜单
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // 检查菜单是否存在
        const menu = await ctx.db.navigationMenu.findUnique({
          where: { id: input.id },
          include: {
            children: true,
          },
        });

        if (!menu) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '导航菜单不存在',
          });
        }

        // 检查是否有子菜单
        if (menu.children.length > 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: '该菜单下还有子菜单，无法删除',
          });
        }

        await ctx.db.navigationMenu.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('删除导航菜单失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '删除导航菜单失败，请稍后重试',
        });
      }
    }),

  // 批量删除导航菜单
  batchDelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.string()).min(1, "请至少选择一个菜单"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // 检查所有菜单是否都存在且没有子菜单
        for (const id of input.ids) {
          const menu = await ctx.db.navigationMenu.findUnique({
            where: { id },
            include: {
              children: true,
            },
          });

          if (!menu) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `菜单 ${id} 不存在`,
            });
          }

          if (menu.children.length > 0) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `菜单 "${menu.name}" 下还有子菜单，无法删除`,
            });
          }
        }

        // 批量删除
        await ctx.db.navigationMenu.deleteMany({
          where: {
            id: {
              in: input.ids,
            },
          },
        });

        return { success: true, deletedCount: input.ids.length };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('批量删除导航菜单失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '批量删除导航菜单失败，请稍后重试',
        });
      }
    }),

  // 更新菜单排序
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
    .mutation(async ({ input, ctx }) => {
      try {
        // 批量更新排序
        const updatePromises = input.updates.map(({ id, order }) =>
          ctx.db.navigationMenu.update({
            where: { id },
            data: { order },
          })
        );

        await Promise.all(updatePromises);

        return { success: true };
      } catch (error) {
        console.error('更新菜单排序失败:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '更新菜单排序失败，请稍后重试',
        });
      }
    }),

  // ============================================
  // 公共 API - 前端获取导航菜单（无需认证）
  // ============================================

  // 获取公开的导航菜单
  getPublic: publicProcedure
    .query(async ({ ctx }) => {
      const buildTree = (menus: any[], parentId: string | null = null): any[] => {
        return menus
          .filter(menu => menu.parentId === parentId)
          .map(menu => ({
            ...menu,
            children: buildTree(menus, menu.id),
          }));
      };

      const allMenus = await ctx.db.navigationMenu.findMany({
        where: {
          isVisible: true, // 只返回可见的菜单
        },
        select: {
          id: true,
          name: true,
          url: true,
          icon: true,
          description: true,
          parentId: true,
          order: true,
          isExternal: true,
          openInNewTab: true,
          requireAuth: true,
          allowedRoles: true,
        },
        orderBy: [
          { order: "asc" },
          { createdAt: "desc" },
        ],
      });

      return buildTree(allMenus);
    }),
});

export type NavigationRouter = typeof navigationRouter; 