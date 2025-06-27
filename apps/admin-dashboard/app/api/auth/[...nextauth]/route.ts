/**
 * NextAuth.js API 路由处理器
 * 
 * 这个文件处理所有的认证相关 API 请求，包括：
 * - 登录 (signin)
 * - 登出 (signout)  
 * - 回调 (callback)
 * - 会话 (session)
 * - CSRF 保护
 * - 提供者配置
 */

import { handlers } from "../../../../auth";

/**
 * 导出 GET 和 POST 处理器
 * NextAuth.js 会根据请求类型和路径自动路由到相应的处理器
 * 
 * 支持的路由：
 * - GET  /api/auth/session     - 获取当前会话
 * - POST /api/auth/session     - 更新会话
 * - GET  /api/auth/providers   - 获取可用的认证提供者
 * - GET  /api/auth/csrf        - 获取 CSRF token
 * - POST /api/auth/signin      - 登录
 * - POST /api/auth/signout     - 登出
 * - GET  /api/auth/callback/*  - OAuth 回调
 * - POST /api/auth/callback/*  - OAuth 回调
 */
export const { GET, POST } = handlers; 