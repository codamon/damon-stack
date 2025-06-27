'use server';

import { signOut } from '../../auth';
import { redirect } from 'next/navigation';

/**
 * 用户退出 Server Action
 * 调用 NextAuth signOut 函数并重定向到登录页
 */
export async function logoutAction() {
  try {
    await signOut({
      redirectTo: '/login',
    });
  } catch (error) {
    console.error('退出登录失败:', error);
    // 如果 signOut 失败，手动重定向
    redirect('/login');
  }
} 