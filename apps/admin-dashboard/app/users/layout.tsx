/**
 * 用户管理路由布局
 * 为所有 /users/* 路由应用统一的后台管理布局
 */

import React from 'react';
import { Layout } from '@/components';

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <Layout>
      {children}
    </Layout>
  );
} 