'use client';

// API客户端和配置
export {
  api,
  apiProxy,
  getApiUrl,
  getApiHeaders,
  getTRPCClientConfig,
  config,
  type Config,
} from './api/client';

// 类型定义
export type {
  AppRouter,
  RouterInputs,
  RouterOutputs,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  Post,
  Category,
  User,
  UserRole,
  DashboardStats,
  ChartData,
  SEOData,
  ContactFormData,
  NewsletterSignupData,
  APIError,
  PostFilters,
  CategoryFilters,
  UserFilters,
  PostSortField,
  CategorySortField,
  UserSortField,
  SortOption,
} from './api/types';

// 文章相关Hooks
export {
  usePosts,
  usePublishedPosts,
  useFeaturedPosts,
  usePost,
  usePostBySlug,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  usePostSortOptions,
  usePostFilterOptions,
  usePostUtils,
} from './hooks/usePosts';

// 分类相关Hooks
export {
  useCategories,
  useCategoryTree,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategorySortOptions,
  useCategoryOptions,
  useCategoryTreeOptions,
  useCategoryUtils,
} from './hooks/useCategories';

// 统计数据相关Hooks
export {
  useDashboardStats,
  useUserGrowthData,
  usePostStats,
  useRecentActivity,
  useStatsUtils,
  useRealTimeStats,
  useExportStats,
} from './hooks/useStats';

// 搜索相关Hooks
export {
  useSearch,
  useSearchHistory,
  useFullTextSearch,
  useSearchSuggestions,
  useTrendingSearch,
  useSearchClickTracking,
  useSearchAnalytics,
  type SearchFilters,
} from './hooks/useSearch';

// SEO工具函数
export { 
  seoUtils, 
  SEO_DEFAULTS,
  type MetadataBase,
  type PostSEOData,
  type PageSEOData,
  type ProductSEOData
} from './utils/seo';

// 数据格式化工具函数
export { formatUtils } from './utils/format';

// 重新导入以供内部使用
import { seoUtils } from './utils/seo';
import { formatUtils } from './utils/format';
import { 
  usePostBySlug, 
  usePublishedPosts,
  useFeaturedPosts,
  usePosts
} from './hooks/usePosts';

// 导入分类hooks
import { useCategories } from './hooks/useCategories';

// 导入统计hooks  
import { 
  useDashboardStats,
  useRecentActivity
} from './hooks/useStats';

// 导入API客户端
import { api } from './api/client';

// 常用工具函数
export const utils = {
  seo: seoUtils,
  format: formatUtils,
};

// 预设的组合Hook (高级用法)
export function usePageData(slug: string) {
  const { data: post, isLoading: postLoading, error: postError } = usePostBySlug(slug);
  const { data: categories } = useCategories();
  const { data: stats } = useDashboardStats();
  
  return {
    post,
    categories,
    stats,
    isLoading: postLoading,
    error: postError,
  };
}

export function useBlogPageData() {
  const { data: posts, isLoading: postsLoading } = usePublishedPosts();
  const { data: categories } = useCategories();
  const { data: featuredPosts } = useFeaturedPosts(3);
  
  return {
    posts,
    categories,
    featuredPosts,
    isLoading: postsLoading,
  };
}

export function useAdminDashboardData() {
  const { data: stats } = useDashboardStats();
  const { data: recentPosts } = usePosts({ limit: 5 });
  const { data: recentActivity } = useRecentActivity(10);
  
  return {
    stats,
    recentPosts,
    recentActivity,
  };
}

// 数据验证工具
export const validators = {
  /**
   * 验证邮箱格式
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证URL格式
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 验证slug格式
   */
  slug: (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  },

  /**
   * 验证手机号格式 (中国)
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },
};

// 常量定义
export const constants = {
  /**
   * 分页默认值
   */
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  /**
   * 缓存时间 (毫秒)
   */
  CACHE_TIME: {
    SHORT: 1000 * 60 * 2,      // 2分钟
    MEDIUM: 1000 * 60 * 5,     // 5分钟
    LONG: 1000 * 60 * 10,      // 10分钟
    VERY_LONG: 1000 * 60 * 15, // 15分钟
  },

  /**
   * 文件大小限制
   */
  FILE_SIZE: {
    IMAGE_MAX: 5 * 1024 * 1024,      // 5MB
    DOCUMENT_MAX: 10 * 1024 * 1024,  // 10MB
    VIDEO_MAX: 100 * 1024 * 1024,    // 100MB
  },

  /**
   * 文本长度限制
   */
  TEXT_LENGTH: {
    TITLE_MAX: 100,
    EXCERPT_MAX: 200,
    DESCRIPTION_MAX: 500,
    CONTENT_MAX: 50000,
    TAG_MAX: 30,
  },

  /**
   * 支持的文件类型
   */
  MIME_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/ogg'],
  },

  /**
   * API状态码
   */
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },
} as const;

// 错误处理工具
export const errorHandlers = {
  /**
   * 格式化API错误信息
   */
  formatApiError: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.data?.message) return error.data.message;
    return '发生未知错误';
  },

  /**
   * 判断是否是网络错误
   */
  isNetworkError: (error: any): boolean => {
    return error?.code === 'NETWORK_ERROR' || error?.message?.includes('fetch');
  },

  /**
   * 判断是否是认证错误
   */
  isAuthError: (error: any): boolean => {
    return error?.code === 'UNAUTHORIZED' || error?.status === 401;
  },

  /**
   * 生成用户友好的错误信息
   */
  getUserFriendlyMessage: (error: any): string => {
    if (errorHandlers.isNetworkError(error)) {
      return '网络连接失败，请检查您的网络设置';
    }
    
    if (errorHandlers.isAuthError(error)) {
      return '登录已过期，请重新登录';
    }
    
    const message = errorHandlers.formatApiError(error);
    
    // 常见错误信息翻译
    const translations: Record<string, string> = {
      'Validation failed': '数据验证失败',
      'Not found': '资源不存在',
      'Access denied': '没有访问权限',
      'Internal server error': '服务器内部错误',
    };
    
    return translations[message] || message;
  },
};

// 版本信息
export const version = '0.1.0';

// 默认导出
export default {
  api,
  utils,
  validators,
  constants,
  errorHandlers,
  version,
}; 