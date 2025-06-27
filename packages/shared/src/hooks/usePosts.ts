'use client';

import { useMemo } from 'react';
import { api } from '../api/client';
import type { Post, PostFilters, PostSortField } from '../api/types';

/**
 * 获取文章列表
 */
export function usePosts(filters?: PostFilters) {
  return (api as any).post.list.useQuery(filters || {}, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 获取已发布的文章列表 (用于前端展示)
 */
export function usePublishedPosts(filters?: Omit<PostFilters, 'published'>) {
  return (api as any).post.published.useQuery(filters || {}, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 10, // 10分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 获取特色文章
 */
export function useFeaturedPosts(limit = 6) {
  return (api as any).post.featured.useQuery({ limit }, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 15, // 15分钟
    refetchOnWindowFocus: false,
  });
}

/**
 * 通过ID获取文章详情
 */
export function usePost(id: string, enabled = true) {
  return (api as any).post.byId.useQuery(
    { id },
    {
      enabled: enabled && !!id,
      staleTime: 1000 * 60 * 5, // 5分钟
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * 通过slug获取文章详情 (用于前端展示)
 */
export function usePostBySlug(slug: string, enabled = true) {
  return (api as any).post.bySlug.useQuery(
    { slug },
    {
      enabled: enabled && !!slug,
      staleTime: 1000 * 60 * 10, // 10分钟
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * 创建文章
 */
export function useCreatePost() {
  const utils = (api as any).useUtils();
  
  return (api as any).post.create.useMutation({
    onSuccess: () => {
      // 刷新文章列表
      utils.post.list.invalidate();
      utils.post.published.invalidate();
    },
  });
}

/**
 * 更新文章
 */
export function useUpdatePost() {
  const utils = (api as any).useUtils();
  
  return (api as any).post.update.useMutation({
    onSuccess: (data: any) => {
      // 刷新相关查询
      utils.post.list.invalidate();
      utils.post.published.invalidate();
      utils.post.byId.invalidate({ id: data.id });
      utils.post.bySlug.invalidate({ slug: data.slug });
    },
  });
}

/**
 * 删除文章
 */
export function useDeletePost() {
  const utils = (api as any).useUtils();
  
  return (api as any).post.delete.useMutation({
    onSuccess: () => {
      // 刷新文章列表
      utils.post.list.invalidate();
      utils.post.published.invalidate();
    },
  });
}

/**
 * 文章排序选项
 */
export function usePostSortOptions() {
  return useMemo(() => [
    { field: 'createdAt' as PostSortField, order: 'desc' as const, label: '创建时间 (最新)' },
    { field: 'createdAt' as PostSortField, order: 'asc' as const, label: '创建时间 (最早)' },
    { field: 'updatedAt' as PostSortField, order: 'desc' as const, label: '更新时间 (最新)' },
    { field: 'publishedAt' as PostSortField, order: 'desc' as const, label: '发布时间 (最新)' },
    { field: 'title' as PostSortField, order: 'asc' as const, label: '标题 (A-Z)' },
    { field: 'title' as PostSortField, order: 'desc' as const, label: '标题 (Z-A)' },
    { field: 'viewCount' as PostSortField, order: 'desc' as const, label: '浏览量 (最高)' },
    { field: 'likeCount' as PostSortField, order: 'desc' as const, label: '点赞数 (最高)' },
  ], []);
}

/**
 * 文章过滤器选项
 */
export function usePostFilterOptions() {
  return useMemo(() => ({
    published: [
      { value: 'all', label: '全部' },
      { value: 'true', label: '已发布' },
      { value: 'false', label: '草稿' },
    ],
    featured: [
      { value: 'all', label: '全部' },
      { value: 'true', label: '特色文章' },
      { value: 'false', label: '普通文章' },
    ],
  }), []);
}

/**
 * 处理文章数据的工具函数
 */
export function usePostUtils() {
  return useMemo(() => ({
    /**
     * 格式化文章状态
     */
    formatStatus: (post: Post) => {
      if (!post.published) return { text: '草稿', color: 'gray' };
      if (post.featured) return { text: '特色', color: 'blue' };
      return { text: '已发布', color: 'green' };
    },

    /**
     * 格式化阅读时间
     */
    formatReadingTime: (minutes?: number) => {
      if (!minutes) return '未知';
      return `${minutes} 分钟阅读`;
    },

    /**
     * 格式化统计数据
     */
    formatStats: (post: Post) => ({
      views: `${post.viewCount || 0} 次浏览`,
      likes: `${post.likeCount || 0} 个赞`,
      readingTime: `${post.readingTime || 0} 分钟`,
    }),

    /**
     * 生成文章摘要
     */
    generateExcerpt: (content: string, maxLength = 150) => {
      const plainText = content.replace(/<[^>]*>/g, '');
      return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
    },

    /**
     * 验证文章slug是否可用
     */
    isSlugValid: (slug: string) => {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      return slugRegex.test(slug);
    },
  }), []);
} 