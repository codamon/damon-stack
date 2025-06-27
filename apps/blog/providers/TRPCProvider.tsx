'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { api, getTRPCClientConfig } from '@damon-stack/shared';

interface TRPCProviderProps {
  children: ReactNode;
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5分钟
            retry: (failureCount, error) => {
              // 网络错误重试，其他错误不重试
              if (failureCount < 3 && error?.message?.includes('fetch')) {
                return true;
              }
              return false;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  const [trpcClient] = useState(() => api.createClient(getTRPCClientConfig()));

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom-right"
            buttonPosition="bottom-right"
          />
        )}
      </QueryClientProvider>
    </api.Provider>
  );
} 