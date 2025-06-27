/**
 * User Management API Types
 * 用户管理API类型定义
 */

import { z } from 'zod';

/**
 * 用户角色枚举
 */
export const UserRole = z.enum(['USER', 'ADMIN']);
export type UserRole = z.infer<typeof UserRole>;

/**
 * 用户状态枚举
 */
export const UserStatus = z.enum(['ACTIVE', 'BANNED']);
export type UserStatus = z.infer<typeof UserStatus>;

/**
 * 用户基础信息类型
 */
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户创建输入验证schema
 */
export const userCreateSchema = z.object({
  name: z.string().min(1, '用户名不能为空').max(100, '用户名不能超过100个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  role: UserRole.default('USER'),
  status: UserStatus.default('ACTIVE'),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;

/**
 * 用户更新输入验证schema
 */
export const userUpdateSchema = z.object({
  id: z.string().min(1, '用户ID不能为空'),
  name: z.string().min(1, '用户名不能为空').max(100, '用户名不能超过100个字符').optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  role: UserRole.optional(),
  status: UserStatus.optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

/**
 * 用户列表查询输入schema
 */
export const userListSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  search: z.string().optional(),
  role: UserRole.optional(),
  status: UserStatus.optional(),
});

export type UserListInput = z.infer<typeof userListSchema>;

/**
 * 用户列表响应类型
 */
export interface UserListResponse {
  items: User[];
  nextCursor?: string;
  hasNextPage: boolean;
}

/**
 * 用户统计响应类型
 */
export interface UserStatsResponse {
  total: number;
  active: number;
  banned: number;
  admin: number;
  regular: number;
}

/**
 * API响应基础类型
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
} 