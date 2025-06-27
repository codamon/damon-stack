import { IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import React from 'react';

export type SortOrder = 'asc' | 'desc';

export interface SortState {
  sortBy: string;
  sortOrder: SortOrder;
}

/**
 * 排序处理器
 */
export function createSortHandler<T extends SortState>(
  setState: React.Dispatch<React.SetStateAction<T>>
) {
  return (field: string) => {
    setState(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1, // 排序时重置到第一页
    }));
  };
}

/**
 * 获取排序图标
 */
export function getSortIcon(currentSortBy: string, targetField: string, sortOrder: SortOrder) {
  if (currentSortBy !== targetField) {
    return React.createElement(IconArrowsSort, { size: 14 });
  }
  
  return sortOrder === 'asc' 
    ? React.createElement(IconSortAscending, { size: 14 })
    : React.createElement(IconSortDescending, { size: 14 });
}

/**
 * 选择处理器
 */
export interface SelectionState {
  selectedRows: string[];
}

export function createSelectionHandlers<T extends SelectionState>(
  setState: React.Dispatch<React.SetStateAction<T>>,
  dataItems?: Array<{ id: string }>
) {
  const handleSelectAll = (checked: boolean) => {
    setState(prev => ({
      ...prev,
      selectedRows: checked ? (dataItems?.map(item => item.id) || []) : [],
    }));
  };

  const handleSelectRow = (itemId: string, checked: boolean) => {
    setState(prev => ({
      ...prev,
      selectedRows: checked 
        ? [...prev.selectedRows, itemId]
        : prev.selectedRows.filter(id => id !== itemId),
    }));
  };

  return { handleSelectAll, handleSelectRow };
}

/**
 * 状态映射工具
 */
export function createStatusMap<T extends string>(
  statusConfig: Record<T, { label: string; color: string }>
) {
  return {
    getLabel: (status: T) => statusConfig[status]?.label || status,
    getColor: (status: T) => statusConfig[status]?.color || 'gray',
    getOptions: () => Object.entries(statusConfig).map(([value, info]) => ({
      value,
      label: info.label,
    })),
  };
}

/**
 * 筛选器状态更新器
 */
export function createFilterUpdater<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
  return (filterName: keyof T, value: any) => {
    setState(prev => ({
      ...prev,
      [filterName]: value || undefined,
      page: 1, // 筛选时重置到第一页
    }));
  };
} 