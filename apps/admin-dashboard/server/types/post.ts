// Post 状态枚举
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';

// User 简化类型（用于关联）
export interface User {
  id: string;
  name: string | null;
  email: string;
}

// Category 简化类型（用于关联）
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tag 类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Post 基础类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  status: PostStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
  readingTime: number | null;
  ogImage: string | null;
  order: number;
  featured: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  authorId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 带关联数据的 Post 类型
export interface PostWithRelations extends Omit<Post, 'authorId' | 'categoryId'> {
  author: User;
  category: Category | null;
  tags: Tag[];
}

// API 输入类型
export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  readingTime?: number;
  ogImage?: string;
  featured?: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdatePostInput {
  id: string;
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  readingTime?: number;
  ogImage?: string;
  featured?: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId?: string;
  categoryId?: string;
  tagIds?: string[];
}

// 查询参数类型
export interface PostListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: PostStatus;
  categoryId?: string;
  authorId?: string;
  featured?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// 分页结果类型
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 