import React from 'react';
import { render, screen } from '@testing-library/react';

import { AppProviders } from './AppProviders';

const mockQueryProvider = jest.fn();
const mockAuthProvider = jest.fn();

jest.mock('./QueryProvider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => {
    mockQueryProvider(children);
    return <div data-testid="query-provider">{children}</div>;
  },
}));

jest.mock('@features/auth', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => {
    mockAuthProvider(children);
    return <div data-testid="auth-provider">{children}</div>;
  },
}));

describe('AppProviders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children through the provider stack', () => {
    render(
      <AppProviders>
        <div>app child</div>
      </AppProviders>,
    );

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByText('app child')).toBeInTheDocument();
  });

  it('includes the expected provider layers', () => {
    render(
      <AppProviders>
        <div>app child</div>
      </AppProviders>,
    );

    expect(mockQueryProvider).toHaveBeenCalled();
    expect(mockAuthProvider).toHaveBeenCalled();
    expect(screen.getByText('app child')).toBeInTheDocument();
  });
});