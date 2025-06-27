/**
 * 当前用户 Hook
 * 基于 NextAuth.js 获取当前登录用户信息
 * 
 * 用于在组件中方便地获取用户信息和权限状态
 */

'use client';

import { useSession } from 'next-auth/react';
import type { User } from 'next-auth';

interface ExtendedUser extends User {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  emailVerified?: Date | null;
  image?: string | null;
  provider?: string;
}

interface UseCurrentUserReturn {
  /** 当前用户信息，如果未登录则为 null */
  user: ExtendedUser | null;
  /** 用户是否已登录 */
  isAuthenticated: boolean;
  /** 用户是否为管理员 */
  isAdmin: boolean;
  /** 用户是否为普通用户 */
  isUser: boolean;
  /** Session 加载状态 */
  isLoading: boolean;
  /** 用户是否未认证 */
  isUnauthenticated: boolean;
  /** 检查用户是否具有特定角色 */
  hasRole: (role: string) => boolean;
  /** 检查用户是否具有管理员权限 */
  canManageUsers: boolean;
  /** 检查用户是否可以访问管理功能 */
  canAccessAdmin: boolean;
}

/**
 * 获取当前用户信息的自定义 Hook
 * 
 * @returns {UseCurrentUserReturn} 包含用户信息和权限状态的对象
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAdmin, isLoading } = useCurrentUser();
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user?.name || user?.email}</p>
 *       {isAdmin && <AdminPanel />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const { data: session, status } = useSession();

  const user = session?.user as ExtendedUser | null;
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!user;
  const isUnauthenticated = status === 'unauthenticated';
  
  // 角色检查
  const userRole = user?.role?.toLowerCase() || '';
  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';
  
  // 权限检查函数
  const hasRole = (role: string): boolean => {
    if (!user || !user.role) return false;
    return user.role.toLowerCase() === role.toLowerCase();
  };
  
  // 管理权限检查
  const canManageUsers = isAdmin;
  const canAccessAdmin = isAdmin;

  return {
    user,
    isAuthenticated,
    isAdmin,
    isUser,
    isLoading,
    isUnauthenticated,
    hasRole,
    canManageUsers,
    canAccessAdmin,
  };
}

/**
 * 权限守卫 Hook
 * 用于在组件中进行权限检查和重定向
 * 
 * @param requiredRole - 需要的角色，如 'admin'
 * @param redirectTo - 权限不足时重定向的路径，默认为 '/dashboard'
 * 
 * @example
 * ```tsx
 * function AdminOnlyComponent() {
 *   const { hasPermission, isLoading } = usePermissionGuard('admin');
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!hasPermission) return <div>Access Denied</div>;
 *   
 *   return <AdminContent />;
 * }
 * ```
 */
export function usePermissionGuard(requiredRole?: string, redirectTo: string = '/dashboard') {
  const { user, isLoading, isAuthenticated, hasRole } = useCurrentUser();
  
  const hasPermission = !requiredRole || (isAuthenticated && hasRole(requiredRole));
  
  return {
    hasPermission,
    isLoading,
    user,
    redirectTo,
    shouldRedirect: !isLoading && !hasPermission,
  };
}

/**
 * 用于条件渲染的权限组件 Hook
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { renderIfAdmin, renderIfAuthenticated } = useConditionalRender();
 *   
 *   return (
 *     <div>
 *       {renderIfAuthenticated(<UserProfile />)}
 *       {renderIfAdmin(<AdminPanel />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useConditionalRender() {
  const { isAuthenticated, isAdmin, user, hasRole } = useCurrentUser();
  
  const renderIfAuthenticated = (component: React.ReactNode) => 
    isAuthenticated ? component : null;
    
  const renderIfAdmin = (component: React.ReactNode) => 
    isAdmin ? component : null;
    
  const renderIfRole = (role: string, component: React.ReactNode) => 
    hasRole(role) ? component : null;
    
  const renderIfOwner = (resourceOwnerId: string, component: React.ReactNode) => 
    user?.id === resourceOwnerId ? component : null;
  
  return {
    renderIfAuthenticated,
    renderIfAdmin,
    renderIfRole,
    renderIfOwner,
  };
} 