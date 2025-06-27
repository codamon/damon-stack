'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { editorialTheme } from '@damon-stack/ui';
import { TRPCProvider } from '../providers/TRPCProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <MantineProvider theme={editorialTheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </TRPCProvider>
  );
} 