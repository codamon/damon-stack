import NextAuth from "next-auth";

/**
 * NextAuth.js 类型扩展
 * 
 * 扩展默认的 User, Session, JWT 类型
 * 添加自定义字段如 role, emailVerified 等
 */

declare module "next-auth" {
  /**
   * 扩展 User 接口
   */
  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    emailVerified?: Date | null;
    provider?: string;
  }

  /**
   * 扩展 Session 接口
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: string;
      emailVerified?: Date | null;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * 扩展 JWT 接口
   */
  interface JWT {
    id?: string;
    role?: string;
    emailVerified?: Date | null;
    provider?: string;
  }
} 