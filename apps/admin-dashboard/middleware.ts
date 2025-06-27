import { auth } from "./auth";
import { NextResponse } from "next/server";

/**
 * NextAuth.js v5 中间件
 * 
 * 保护需要认证的路由并处理重定向
 * 基于 auth.config.ts 配置
 */
export default auth((req) => {
  // 获取请求路径
  const { pathname } = req.nextUrl;
  
  // 检查是否已认证
  const isAuthenticated = !!req.auth?.user;
  const userRole = req.auth?.user?.role || 'user';

  // 定义路由类型
  const publicRoutes = ['/login', '/auth/signin', '/auth/signup', '/auth/error'];
  const authRoutes = ['/login', '/auth/signin', '/auth/signup'];
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/users', '/analytics'];
  const adminRoutes = ['/admin'];

  // 检查路径类型
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/auth');
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isRootRoute = pathname === '/';

  // 开发环境调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${pathname} - 认证状态: ${isAuthenticated ? '已登录' : '未登录'} - 角色: ${userRole}`);
  }

  // 🔄 已登录用户访问根路由，重定向到仪表板
  if (isAuthenticated && isRootRoute) {
    console.log(`[Middleware] 已登录用户访问根路由，重定向到仪表板`);
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // 如果用户已登录访问认证页面，重定向到仪表板
  if (isAuthenticated && isAuthRoute) {
    console.log(`[Middleware] 已登录用户访问认证页面，重定向到仪表板`);
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // 如果用户未登录访问保护的路由，重定向到登录页
  if (!isAuthenticated && isProtectedRoute) {
    console.log(`[Middleware] 未登录用户访问保护路由，重定向到登录页`);
    const signInUrl = new URL('/login', req.nextUrl);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 如果用户访问管理路由但不是管理员，重定向到仪表板
  if (isAuthenticated && isAdminRoute && userRole !== 'admin') {
    console.log(`[Middleware] 非管理员用户访问管理路由，重定向到仪表板`);
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // 如果用户未登录访问管理路由，重定向到登录页
  if (!isAuthenticated && isAdminRoute) {
    console.log(`[Middleware] 未登录用户访问管理路由，重定向到登录页`);
    const signInUrl = new URL('/login', req.nextUrl);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 允许请求继续
  return NextResponse.next();
});

/**
 * 中间件配置
 * 指定哪些路径应该运行中间件
 * 
 * 匹配所有路径，但排除：
 * - API 路由（除了 /api/auth）
 * - 静态文件
 * - 图片优化
 * - 网站图标
 * - 公共资源文件
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api 路由（除了 /api/auth）
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     * - 公共文件（.svg, .png, .jpg, .jpeg, .gif, .webp）
     * - /login 路径的静态资源
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 