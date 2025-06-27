/**
 * User Management API Module
 * 用户管理API模块导出入口
 */

// API路由工厂函数和类型定义
export * from './routes';
export * from './types';

// 注意：userRouter 需要在主应用中通过 createUserRouter 创建
// 功能模块不直接依赖主应用的 tRPC 实例 