/**
 * 分类管理路由布局  
 * 由于上级 cms/layout.tsx 已经提供了 Layout，这里只需要透传 children
 */

import { ReactNode } from 'react';

interface CategoriesLayoutProps {
  children: ReactNode;
}

export default function CategoriesLayout({ children }: CategoriesLayoutProps) {
  return <>{children}</>;
} 