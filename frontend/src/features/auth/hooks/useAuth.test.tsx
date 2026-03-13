import { render, screen } from '@testing-library/react';

import { useAuth } from './useAuth';
import { AuthContext, type AuthContextValue } from '../context/authContext';

function Probe() {
  const { user, isBootstrapping } = useAuth();
  return (
    <>
      <div data-testid="email">{user?.email ?? 'none'}</div>
      <div data-testid="bootstrapping">{String(isBootstrapping)}</div>
    </>
  );
}

describe('useAuth', () => {
  it('throws a clear error when used outside AuthProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow('useAuth must be used within AuthProvider');

    spy.mockRestore();
  });

  it('returns the current auth context value', () => {
    const value: AuthContextValue = {
      user: {
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
        firstName: 'John',
        lastName: 'Doe',
      },
      isBootstrapping: false,
      login: jest.fn().mockResolvedValue(undefined),
      register: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={value}>
        <Probe />
      </AuthContext.Provider>,
    );

    expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
  });

  it('returns null user when context is unauthenticated', () => {
    const value: AuthContextValue = {
      user: null,
      isBootstrapping: true,
      login: jest.fn().mockResolvedValue(undefined),
      register: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={value}>
        <Probe />
      </AuthContext.Provider>,
    );

    expect(screen.getByTestId('email')).toHaveTextContent('none');
    expect(screen.getByTestId('bootstrapping')).toHaveTextContent('true');
  });
});