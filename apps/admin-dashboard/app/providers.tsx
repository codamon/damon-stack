'use client';

/**
 * 客户端 Providers 组件
 * 包含 MantineProvider、ModalsProvider 和 TRPCReactProvider
 * 
 * 更新: 集成了来自 @damon-stack/ui 的中心化主题系统
 */

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { dashboardTheme } from '@damon-stack/ui'; // 导入后台专用主题
import { TRPCReactProvider } from '../trpc/react';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  session?: any; // NextAuth session type
}

/**
 * 全局 Provider 组件
 * 配置 Mantine 主题、Modal 和 NextAuth 会话
 */
export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider theme={dashboardTheme}>
        <ModalsProvider>
          <Notifications />
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
} 