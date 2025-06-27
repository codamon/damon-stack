/**
 * CMS内容管理路由布局
 * 为所有 /cms/* 路由应用统一的后台管理布局
 */

import { ReactNode } from 'react';
import { Layout } from '../../components';

interface CMSLayoutProps {
  children: ReactNode;
}

export default function CMSLayout({ children }: CMSLayoutProps) {
  return (
    <Layout>
      {children}
    </Layout>
  );
} 