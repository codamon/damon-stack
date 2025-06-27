import { useMemo } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}

interface SelectOption {
  value: string;
  label: string;
}

/**
 * 自定义hook：处理分类选项数据转换
 */
export function useCategoryOptions(categories: Category[] = []): SelectOption[] {
  return useMemo(() => {
    return categories.map(cat => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categories]);
}

// 专门用于筛选器的分类选项hook，包含"全部分类"选项
export function useCategoryFilterOptions(categories: Category[] = []): SelectOption[] {
  return useMemo(() => {
    return [
      { value: '', label: '全部分类' },
      ...categories.map(cat => ({
        value: cat.id,
        label: cat.name,
      }))
    ];
  }, [categories]);
}

// 递归获取所有层级的分类选项（扁平化）
export function useFlatCategoryOptions(categories: Category[] = []): SelectOption[] {
  return useMemo(() => {
    const flattenCategories = (cats: Category[], level: number = 0): SelectOption[] => {
      const result: SelectOption[] = [];
      
      for (const cat of cats) {
        const prefix = '—'.repeat(level);
        result.push({
          value: cat.id,
          label: level > 0 ? `${prefix} ${cat.name}` : cat.name,
        });
        
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenCategories(cat.children, level + 1));
        }
      }
      
      return result;
    };
    
    return flattenCategories(categories);
  }, [categories]);
} 