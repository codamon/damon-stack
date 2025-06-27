/**
 * Dashboard路由布局
 * 为 /dashboard 路由应用统一的后台管理布局
 */

import { ReactNode } from 'react';
import { Layout } from '../../components';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Layout>
      {children}
    </Layout>
  );
} 