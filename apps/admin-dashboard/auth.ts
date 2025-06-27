import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";

// 导入数据库实例和基础配置
import { db } from "@damon-stack/db";
import authConfig from "./auth.config";
import { AuthService } from "./services/auth.service";

/**
 * NextAuth.js 主配置文件
 * 
 * 包含 Prisma 适配器、认证提供者和完整的认证逻辑
 */

/**
 * 登录凭据验证架构
 */
const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6位字符"),
});

/**
 * 用户验证函数
 * 使用认证服务层验证用户邮箱和密码
 */
async function verifyCredentials(email: string, password: string) {
  return await AuthService.verifyCredentials(email, password);
}

/**
 * 创建并导出 NextAuth 实例
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  /**
   * 数据库适配器
   * 使用 Prisma 适配器连接数据库
   */
  adapter: PrismaAdapter(db),

  /**
   * 认证提供者配置
   */
  providers: [
    /**
     * 凭据提供者（邮箱 + 密码）
     */
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "邮箱地址",
          type: "email",
          placeholder: "user@example.com"
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码"
        }
      },
      async authorize(credentials) {
        try {
          // 验证输入数据
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            console.log("登录数据验证失败:", validatedFields.error.flatten().fieldErrors);
            return null;
          }

          const { email, password } = validatedFields.data;

          // 验证用户凭据
          const user = await verifyCredentials(email, password);

          if (!user) {
            return null;
          }

          // 返回用户对象
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified,
            image: user.image,
          };
        } catch (error) {
          console.error("认证过程中发生错误:", error);
          return null;
        }
      }
    }),

    // 未来可以添加其他提供者
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // 
    // GitHub({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),
  ],

  /**
   * 会话策略
   * 使用 JWT 以支持凭据提供者
   */
  session: {
    strategy: "jwt",
  },

  /**
   * 扩展回调函数
   */
  callbacks: {
    ...authConfig.callbacks,

    /**
     * 重定向回调
     * 控制登录后的重定向行为
     */
    async redirect({ url, baseUrl }) {
      // 如果 URL 是相对路径，直接使用
      if (url.startsWith("/")) {
        // 如果有指定的回调 URL，使用它
        if (url !== "/") {
          return `${baseUrl}${url}`;
        }
        // 否则默认重定向到 dashboard
        return `${baseUrl}/dashboard`;
      }
      
      // 如果 URL 是同域的完整 URL
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // 默认重定向到 dashboard
      return `${baseUrl}/dashboard`;
    },

    /**
     * JWT 回调 - 扩展版本
     * 添加额外的用户信息到 token
     */
    async jwt({ token, user, account, trigger, session }) {
      // 调用基础配置的 jwt 回调
      token = await authConfig.callbacks?.jwt?.({ token, user, account }) || token;

      // 如果是更新触发器，更新 token 信息
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
      }

              // 首次登录时从服务层获取最新用户信息
        if (user) {
          try {
            const dbUser = await AuthService.getUserById(user.id);

            if (dbUser) {
              token.id = dbUser.id;
              token.email = dbUser.email;
              token.name = dbUser.name;
              token.role = dbUser.role;
              token.emailVerified = dbUser.emailVerified;
              token.picture = dbUser.image;
            }
          } catch (error) {
            console.error("获取用户信息失败:", error);
          }
        }

      return token;
    },

    /**
     * Session 回调 - 扩展版本
     * 添加额外的用户信息到 session
     */
    async session({ session, token }) {
      // 添加额外信息
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.image = token.picture as string | null;
      }

      return session;
    },
  },

  /**
   * 扩展事件处理器
   */
  events: {
    ...authConfig.events,

    async signIn({ user, account, profile, isNewUser }) {
      // 调用基础配置的事件处理器
      await authConfig.events?.signIn?.({ user, account, profile, isNewUser });

      // 更新用户最后登录时间
      if (user.id) {
        await AuthService.updateLastLoginTime(user.id);
      }
    },
  },
});

/**
 * 认证相关的辅助函数
 */

/**
 * 获取当前会话
 * 在服务器端组件中使用
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * 检查用户是否为管理员
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * 获取用户完整信息
 * 使用认证服务层获取最新的用户信息
 */
export async function getUserById(id: string) {
  return await AuthService.getUserWithDetails(id);
} 