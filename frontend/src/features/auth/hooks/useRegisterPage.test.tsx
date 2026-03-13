import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useRegisterPage } from './useRegisterPage';

const mockNavigate = jest.fn();
const mockRegister = jest.fn();
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
    register: (...args: unknown[]) => mockRegister(...args),
  }),
}));

jest.mock('@shared/lib/http', () => ({
  getErrorMessage: (...args: unknown[]) => mockGetErrorMessage(...args),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useRegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockReturnValue('Registration failed');
  });

  it('initializes with expected defaults', () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.acceptTerms).toBe(true);
    expect(result.current.showPassword).toBe(false);
    expect(result.current.canSubmit).toBe(false);
  });

  it('enables submit only when all fields are valid and terms are accepted', () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.setFirstName('John');
      result.current.setLastName('Doe');
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
      result.current.setAcceptTerms(true);
    });

    expect(result.current.firstOk).toBe(true);
    expect(result.current.lastOk).toBe(true);
    expect(result.current.emailOk).toBe(true);
    expect(result.current.passwordOk).toBe(true);
    expect(result.current.canSubmit).toBe(true);
  });

  it('tracks touched state per field', () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.markTouched('firstName');
      result.current.markTouched('email');
    });

    expect(result.current.touched).toEqual({
      firstName: true,
      lastName: false,
      email: true,
      password: false,
    });
  });

  it('toggles password visibility', () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.toggleShowPassword();
    });

    expect(result.current.showPassword).toBe(true);
  });

  it('navigates with helper actions', () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.goHome();
      result.current.goLogin();
    });

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/login');
  });

  it('does not submit when validation fails', async () => {
    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockRegister).not.toHaveBeenCalled();
    expect(result.current.touched).toEqual({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });
  });

  it('submits trimmed values and redirects on success', async () => {
    mockRegister.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.setFirstName('  John ');
      result.current.setLastName(' Doe  ');
      result.current.setEmail('  john@example.com  ');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    expect(mockRegister).toHaveBeenCalledWith(
      'John',
      'Doe',
      'john@example.com',
      'secret123',
    );
    expect(mockNavigate).toHaveBeenCalledWith('/app/positions', { replace: true });
  });

  it('sets a friendly error and resets submitting on failure', async () => {
    mockRegister.mockRejectedValueOnce(new Error('boom'));
    mockGetErrorMessage.mockReturnValueOnce('Email already exists');

    const { result } = renderHook(() => useRegisterPage(), { wrapper });

    act(() => {
      result.current.setFirstName('John');
      result.current.setLastName('Doe');
      result.current.setEmail('john@example.com');
      result.current.setPassword('secret123');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent);
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Email already exists');
    });

    expect(result.current.submitting).toBe(false);
  });
});