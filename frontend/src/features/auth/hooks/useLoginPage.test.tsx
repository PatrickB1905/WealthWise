import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useLoginPage } from './useLoginPage';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockGetErrorMessage = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => ({
    login: (...args: unknown[]) => mockLogin(...args),
  }),
}));

jest.mock('@shared/lib/http', () => ({
  getErrorMessage: (...args: unknown[]) => mockGetErrorMessage(...args),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useLoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockReturnValue('Login failed');
  });

  it('initializes with sensible defaults', () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.rememberMe).toBe(true);
    expect(result.current.showPassword).toBe(false);
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.submitting).toBe(false);
  });

  it('validates email and password before allowing submit', () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
    });

    expect(result.current.emailOk).toBe(true);
    expect(result.current.passwordOk).toBe(true);
    expect(result.current.canSubmit).toBe(true);
  });

  it('marks fields touched on blur helpers', () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.markEmailTouched();
      result.current.markPasswordTouched();
    });

    expect(result.current.touched).toEqual({
      email: true,
      password: true,
    });
  });

  it('toggles password visibility', () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.toggleShowPassword();
    });

    expect(result.current.showPassword).toBe(true);
  });

  it('navigates to home and register via helper actions', () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.goHome();
      result.current.goRegister();
    });

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/register');
  });

  it('does not submit when validation fails', async () => {
    const { result } = renderHook(() => useLoginPage(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.touched).toEqual({
      email: true,
      password: true,
    });
  });

  it('submits trimmed credentials and redirects on success', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.setEmail('  john@example.com  ');
      result.current.setPassword('  secret123  ');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockLogin).toHaveBeenCalledWith('john@example.com', 'secret123');
    expect(mockNavigate).toHaveBeenCalledWith('/app/positions', { replace: true });
  });

  it('surfaces a friendly error on login failure and resets submitting', async () => {
    const failure = new Error('boom');
    mockLogin.mockRejectedValueOnce(failure);
    mockGetErrorMessage.mockReturnValueOnce('Bad credentials');

    const { result } = renderHook(() => useLoginPage(), { wrapper });

    act(() => {
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Bad credentials');
    });

    expect(result.current.submitting).toBe(false);
  });
});