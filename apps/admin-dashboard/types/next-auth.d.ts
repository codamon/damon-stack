/**
 * NextAuth.js 类型扩展
 * 
 * 扩展 NextAuth.js 的默认类型定义，
 * 添加项目特定的用户属性和会话属性
 */

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

/**
 * 扩展 NextAuth 模块类型
 */
declare module "next-auth" {
  /**
   * 用户对象类型扩展
   * 添加项目特定的用户属性
   */
  interface User extends DefaultUser {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    emailVerified?: Date | null;
    image?: string | null;
    provider?: string;
  }

  /**
   * 会话对象类型扩展
   * 添加项目特定的会话属性
   */
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      emailVerified?: Date | null;
      image?: string | null;
      provider?: string;
    } & DefaultSession["user"];
  }
}

/**
 * 扩展 NextAuth JWT 模块类型
 */
declare module "next-auth/jwt" {
  /**
   * JWT Token 类型扩展
   * 添加项目特定的 token 属性
   */
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    emailVerified?: Date | null;
    provider?: string;
    accessToken?: string;
  }
} 