// Category 相关类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: Category;
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  order?: number;
}

// Post 状态枚举
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED';

// User 简化类型（用于关联）
export interface User {
  id: string;
  name?: string;
  email: string;
}

// Tag 相关类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTagInput {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateTagInput {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
}

// Post 相关类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  order: number;
  featured: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 带关联数据的 Post 类型
export interface PostWithRelations extends Omit<Post, 'authorId' | 'categoryId'> {
  author: User;
  category?: Category;
  tags: Tag[];
}

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  order?: number;
  featured?: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId: string;
  categoryId?: string;
  tagIds?: string[]; // 标签 ID 数组
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  order?: number;
  featured?: boolean;
  publishedAt?: Date;
  scheduledAt?: Date;
  authorId?: string;
  categoryId?: string;
  tagIds?: string[];
}

// 分页和筛选参数
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

// 分页结果
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 