import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import theme from '@shared/theme';
import { makeTestQueryClient } from './testQueryClient';

type Options = {
  route?: string;
} & Omit<RenderOptions, 'wrapper'>;

export function renderWithProviders(ui: React.ReactElement, options: Options = {}) {
  const { route = '/', ...renderOptions } = options;
  const queryClient = makeTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}