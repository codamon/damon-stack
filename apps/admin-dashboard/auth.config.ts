import type { NextAuthConfig } from "next-auth";

/**
 * NextAuth.js 基础配置
 * 
 * 这个配置文件包含不依赖 Prisma 适配器的设置，
 * 可以在 Edge Runtime 环境中使用。
 */
const authConfig: NextAuthConfig = {
  /**
   * 密钥配置 - 用于加密 JWT 和会话
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * 提供者 - 在主配置中定义，这里为空数组
   */
  providers: [],

  /**
   * 自定义页面路径
   * 配置登录、注册、错误页面等的自定义路径
   */
  pages: {
    signIn: '/login',                     // 自定义登录页面
    error: '/auth/error',                 // 认证错误页面
    verifyRequest: '/auth/verify-request', // 邮箱验证请求页面
    newUser: '/auth/new-user'             // 新用户欢迎页面
  },

  /**
   * 会话配置
   */
  session: {
    strategy: 'jwt',              // 使用 JWT 策略（适合无状态应用）
    maxAge: 30 * 24 * 60 * 60,    // 30 天（秒）
    updateAge: 24 * 60 * 60,      // 24 小时更新一次（秒）
  },

  /**
   * JWT 配置
   */
  jwt: {
    maxAge: 30 * 24 * 60 * 60,    // 30 天（秒）
  },

  /**
   * 回调函数
   * 用于自定义认证流程的各个阶段
   */
  callbacks: {
    /**
     * JWT 回调
     * 每次创建、更新或访问 JWT 时调用
     */
    async jwt({ token, user, account }) {
      // 首次登录时，user 对象可用
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
        token.emailVerified = user.emailVerified;
      }

      // 添加账户信息
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }

      return token;
    },

    /**
     * Session 回调
     * 每次检查会话时调用，用于向客户端发送会话数据
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.provider = token.provider as string;
      }

      return session;
    },

    /**
     * 授权回调
     * 控制用户是否有权限访问
     */
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      // 保护的路径
      const protectedPaths = ['/dashboard', '/admin', '/profile'];
      const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

      // 如果是保护的路径但用户未登录，则拒绝访问
      if (isProtectedPath && !auth?.user) {
        return false;
      }

      // 管理员路径额外检查
      if (pathname.startsWith('/admin') && auth?.user?.role !== 'admin') {
        return false;
      }

      return true;
    },

    /**
     * 登录回调
     * 控制用户是否允许登录
     */
    async signIn({ user, account, profile, email, credentials }) {
      // 对于凭据登录，在 authorize 函数中已经验证过
      if (account?.provider === 'credentials') {
        return true;
      }

      // 对于 OAuth 提供者，可以添加额外验证
      if (account?.provider === 'google' || account?.provider === 'github') {
        // 检查邮箱域名限制（可选）
        const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || [];
        if (allowedDomains.length > 0 && user.email) {
          const emailDomain = user.email.split('@')[1];
          if (!allowedDomains.includes(emailDomain)) {
            return false; // 拒绝登录
          }
        }
        return true;
      }

      return true;
    },

    /**
     * 重定向回调
     * 控制认证后的重定向行为
     */
    async redirect({ url, baseUrl }) {
      // 如果 URL 是相对路径，允许重定向
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // 如果 URL 是相同来源，允许重定向
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // 否则重定向到首页
      return baseUrl;
    }
  },

  /**
   * 事件处理器
   * 用于记录认证相关事件
   */
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`用户登录: ${user.email} (Provider: ${account?.provider})`);
      
      // 新用户欢迎逻辑
      if (isNewUser) {
        console.log(`新用户注册: ${user.email}`);
        // 这里可以发送欢迎邮件、创建默认设置等
      }
    },

    async signOut(message) {
      if ('session' in message && message.session) {
        console.log(`用户登出: 会话已结束`);
      } else if ('token' in message && message.token?.email) {
        console.log(`用户登出: ${message.token.email}`);
      }
    },

    async createUser({ user }) {
      console.log(`创建新用户: ${user.email}`);
    },

    async updateUser({ user }) {
      console.log(`更新用户信息: ${user.email}`);
    },

    async linkAccount({ user, account, profile }) {
      console.log(`关联账户: ${user.email} -> ${account.provider}`);
    },

    async session({ session, token }) {
      // 可以用于记录会话访问日志
      // console.log(`会话访问: ${session?.user?.email}`);
    }
  },

  /**
   * 调试配置（仅在开发环境启用）
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * 信任的主机列表
   */
  trustHost: true,

  /**
   * 使用安全 cookies（生产环境中自动启用 HTTPS）
   */
  useSecureCookies: process.env.NODE_ENV === 'production',

  /**
   * Cookie 配置
   */
  cookies: {
    sessionToken: {
      name: 'damon-stack.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      }
    }
  }
};

export default authConfig; 