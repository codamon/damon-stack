'use client';

// 重新导出AppRouter类型
export type { AppRouter, RouterInputs, RouterOutputs } from '../../types/app-router';

// 通用API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页相关类型
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// 文章相关类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt?: Date;
  updatedAt: Date;
  authorId: string;
  categoryId?: string;
  published: boolean;
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  // 关联数据
  author?: User;
  category?: Category;
}

// 分类相关类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  // 关联数据
  children?: Category[];
  parent?: Category;
  posts?: Post[];
  _count?: {
    posts: number;
    children: number;
  };
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  // 统计信息
  _count?: {
    posts: number;
  };
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

// 统计数据类型
export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalCategories: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  // 增长数据
  userGrowth: {
    current: number;
    previous: number;
    percentage: number;
  };
  postGrowth: {
    current: number;
    previous: number;
    percentage: number;
  };
  viewGrowth: {
    current: number;
    previous: number;
    percentage: number;
  };
}

// 图表数据类型
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

// SEO相关类型
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'article' | 'website' | 'blog';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

// 表单相关类型
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  type?: string;
}

export interface NewsletterSignupData {
  email: string;
  name?: string;
  preferences?: {
    news?: boolean;
    updates?: boolean;
    promotions?: boolean;
    events?: boolean;
  };
}

// API错误类型
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// 过滤器类型
export interface PostFilters extends PaginationParams {
  categoryId?: string;
  authorId?: string;
  published?: boolean;
  featured?: boolean;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export interface CategoryFilters extends PaginationParams {
  parentId?: string;
  hasChildren?: boolean;
}

export interface UserFilters extends PaginationParams {
  role?: UserRole;
  emailVerified?: boolean;
  startDate?: string;
  endDate?: string;
}

// 排序选项
export type PostSortField = 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount' | 'likeCount';
export type CategorySortField = 'name' | 'createdAt' | 'order' | 'postsCount';
export type UserSortField = 'name' | 'email' | 'createdAt' | 'postsCount';

export interface SortOption<T = string> {
  field: T;
  order: 'asc' | 'desc';
  label: string;
} 