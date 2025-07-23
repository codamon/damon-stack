'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { editorialTheme } from '@damon-stack/ui';
import { TRPCReactProvider } from '../trpc/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <MantineProvider theme={editorialTheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </TRPCReactProvider>
  );
} 