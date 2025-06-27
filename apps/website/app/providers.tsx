'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { corporateTheme } from '@damon-stack/ui';
import { TRPCProvider } from '../providers/TRPCProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <MantineProvider theme={corporateTheme}>
        <Notifications />
        {children}
      </MantineProvider>
    </TRPCProvider>
  );
} 