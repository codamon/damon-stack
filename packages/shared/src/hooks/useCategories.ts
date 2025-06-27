'use client';

import { useMemo } from 'react';
import { api } from '../api/client';
import type { Category, CategoryFilters, CategorySortField } from '../api/types';

/**
 * 获取分类列表
 */
export function useCategories(filters?: CategoryFilters) {
  return (api as any).category.list.useQuery(filters || {}, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10, // 10分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 获取分类树结构
 */
export function useCategoryTree() {
  return (api as any).category.tree.useQuery(undefined, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 15, // 15分钟 (分类结构变化不频繁)
    refetchOnWindowFocus: false,
  });
}

/**
 * 通过ID获取分类详情
 */
export function useCategory(id: string, enabled = true) {
  return (api as any).category.byId.useQuery(
    { id },
    {
      enabled: enabled && !!id,
      staleTime: 1000 * 60 * 10, // 10分钟
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * 创建分类
 */
export function useCreateCategory() {
  const utils = (api as any).useUtils();
  
  return (api as any).category.create.useMutation({
    onSuccess: () => {
      // 刷新分类相关查询
      utils.category.list.invalidate();
      utils.category.tree.invalidate();
    },
  });
}

/**
 * 更新分类
 */
export function useUpdateCategory() {
  const utils = (api as any).useUtils();
  
  return (api as any).category.update.useMutation({
    onSuccess: (data: any) => {
      // 刷新相关查询
      utils.category.list.invalidate();
      utils.category.tree.invalidate();
      utils.category.byId.invalidate({ id: data.id });
    },
  });
}

/**
 * 删除分类
 */
export function useDeleteCategory() {
  const utils = (api as any).useUtils();
  
  return (api as any).category.delete.useMutation({
    onSuccess: () => {
      // 刷新分类列表
      utils.category.list.invalidate();
      utils.category.tree.invalidate();
    },
  });
}

/**
 * 分类排序选项
 */
export function useCategorySortOptions() {
  return useMemo(() => [
    { field: 'order' as CategorySortField, order: 'asc' as const, label: '排序 (升序)' },
    { field: 'order' as CategorySortField, order: 'desc' as const, label: '排序 (降序)' },
    { field: 'name' as CategorySortField, order: 'asc' as const, label: '名称 (A-Z)' },
    { field: 'name' as CategorySortField, order: 'desc' as const, label: '名称 (Z-A)' },
    { field: 'createdAt' as CategorySortField, order: 'desc' as const, label: '创建时间 (最新)' },
    { field: 'createdAt' as CategorySortField, order: 'asc' as const, label: '创建时间 (最早)' },
    { field: 'postsCount' as CategorySortField, order: 'desc' as const, label: '文章数量 (最多)' },
  ], []);
}

/**
 * 分类选择器选项 (用于表单下拉选择)
 */
export function useCategoryOptions() {
  const { data: categories = [] } = useCategories();
  
  return useMemo(() => {
    return categories.map((category: any) => ({
      value: category.id,
      label: category.name,
      description: category.description,
      disabled: false,
    }));
  }, [categories]);
}

/**
 * 分类树选择器选项 (支持层级结构)
 */
export function useCategoryTreeOptions() {
  const { data: categoryTree = [] } = useCategoryTree();
  
  return useMemo(() => {
    const flattenTree = (categories: Category[], level = 0): Array<{
      value: string;
      label: string;
      level: number;
      hasChildren: boolean;
    }> => {
      return categories.reduce((acc, category) => {
        acc.push({
          value: category.id,
          label: category.name,
          level,
          hasChildren: (category.children?.length || 0) > 0,
        });
        
        if (category.children?.length) {
          acc.push(...flattenTree(category.children, level + 1));
        }
        
        return acc;
      }, [] as Array<{
        value: string;
        label: string;
        level: number;
        hasChildren: boolean;
      }>);
    };
    
    return flattenTree(categoryTree);
  }, [categoryTree]);
}

/**
 * 处理分类数据的工具函数
 */
export function useCategoryUtils() {
  return useMemo(() => ({
    /**
     * 格式化分类路径
     */
    formatPath: (category: Category, categories: Category[]) => {
      const path: string[] = [];
      let current = category;
      
      while (current) {
        path.unshift(current.name);
        current = categories.find(c => c.id === current.parentId) as Category;
      }
      
      return path.join(' > ');
    },

    /**
     * 获取分类层级
     */
    getCategoryLevel: (categoryId: string, categories: Category[]): number => {
      let level = 0;
      let current = categories.find(c => c.id === categoryId);
      
      while (current?.parentId) {
        level++;
        current = categories.find(c => c.id === current!.parentId);
      }
      
      return level;
    },

    /**
     * 检查是否是子分类
     */
    isChildCategory: (childId: string, parentId: string, categories: Category[]): boolean => {
      let current = categories.find(c => c.id === childId);
      
      while (current?.parentId) {
        if (current.parentId === parentId) return true;
        current = categories.find(c => c.id === current!.parentId);
      }
      
      return false;
    },

    /**
     * 获取分类的所有子分类
     */
    getChildCategories: (parentId: string, categories: Category[]): Category[] => {
      return categories.filter(c => c.parentId === parentId);
    },

    /**
     * 获取分类的所有祖先分类
     */
    getAncestorCategories: (categoryId: string, categories: Category[]): Category[] => {
      const ancestors: Category[] = [];
      let current = categories.find(c => c.id === categoryId);
      
      while (current?.parentId) {
        const parent = categories.find(c => c.id === current!.parentId);
        if (parent) {
          ancestors.unshift(parent);
          current = parent;
        } else {
          break;
        }
      }
      
      return ancestors;
    },

    /**
     * 验证分类slug是否可用
     */
    isSlugValid: (slug: string) => {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      return slugRegex.test(slug);
    },

    /**
     * 生成分类颜色
     */
    generateColor: () => {
      const colors = [
        'blue', 'green', 'red', 'yellow', 'purple', 
        'cyan', 'orange', 'pink', 'indigo', 'teal'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  }), []);
} 