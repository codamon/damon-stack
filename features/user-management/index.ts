/**
 * User Management Feature Module
 * 用户管理功能模块主入口
 * 
 * @package @damon-stack/feature-user-management
 * @version 1.0.0
 * @author Damon Stack Team
 */

// API模块导出
export * from './api';

// 组件模块导出  
export * from './components';

// 功能模块元信息
export const USER_MANAGEMENT_MODULE = {
  name: '@damon-stack/feature-user-management',
  version: '1.0.0',
  description: 'User Management Feature Module for Damon Stack',
  routes: ['/users'],
  permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
} as const; 