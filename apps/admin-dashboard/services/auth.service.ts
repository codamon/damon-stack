/**
 * 认证服务层
 * 处理所有认证相关的数据访问逻辑
 */

import { compare } from "bcryptjs";
import { db } from "@damon-stack/db";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  image: string | null;
}

/**
 * 用户验证服务
 */
export class AuthService {
  /**
   * 验证用户凭据
   */
  static async verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
    try {
      // 查找用户
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          name: true,
          hashedPassword: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      // 用户不存在
      if (!user) {
        console.log(`登录失败: 用户不存在 - ${email}`);
        return null;
      }

      // 用户没有设置密码（可能是通过 OAuth 注册的）
      if (!user.hashedPassword) {
        console.log(`登录失败: 用户未设置密码 - ${email}`);
        return null;
      }

      // 验证密码
      const isValidPassword = await compare(password, user.hashedPassword);
      if (!isValidPassword) {
        console.log(`登录失败: 密码错误 - ${email}`);
        return null;
      }

      console.log(`登录成功: ${email}`);

      // 返回用户信息（不包含密码）
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
      };
    } catch (error) {
      console.error("用户验证过程中发生错误:", error);
      return null;
    }
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(id: string): Promise<AuthUser | null> {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          image: true,
        }
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
      };
    } catch (error) {
      console.error("获取用户信息失败:", error);
      return null;
    }
  }

  /**
   * 更新用户最后登录时间
   */
  static async updateLastLoginTime(userId: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() }
      });
    } catch (error) {
      console.error("更新最后登录时间失败:", error);
    }
  }

  /**
   * 获取用户完整信息（包含额外字段）
   */
  static async getUserWithDetails(id: string) {
    try {
      const user = await db.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        }
      });
      return user;
    } catch (error) {
      console.error("获取用户详细信息失败:", error);
      return null;
    }
  }
} 