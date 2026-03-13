import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@shared/lib/query-client';

type Props = { children: React.ReactNode };

type ViteLikeEnv = {
  DEV?: boolean;
  MODE?: string;
};

function isDevEnv(): boolean {
  const viteEnv = (globalThis as { __VITE_ENV__?: ViteLikeEnv }).__VITE_ENV__;

  if (typeof viteEnv?.DEV === 'boolean') {
    return viteEnv.DEV;
  }

  if (typeof viteEnv?.MODE === 'string') {
    return viteEnv.MODE !== 'production';
  }

  return process.env.NODE_ENV !== 'production';
}

export function QueryProvider({ children }: Props) {
  const showDevtools = isDevEnv();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}