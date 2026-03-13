import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

import { makeTestQueryClient } from '@test/testQueryClient';
import { useProfilePage } from './useProfilePage';
import { baseProfile } from './__mocks__/profileFixtures';

const mockApiGet = jest.fn();
const mockApiPut = jest.fn();
const mockApiDelete = jest.fn();
const mockLogout = jest.fn();
const mockGetErrorMessage = jest.fn();

jest.mock('@shared/lib/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}));

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => ({
    logout: () => mockLogout(),
  }),
}));

jest.mock('@shared/lib/http', () => ({
  getErrorMessage: (...args: unknown[]) => mockGetErrorMessage(...args),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MemoryRouter>
    );
  };
}

describe('useProfilePage password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockImplementation((_err: unknown, fallback: string) => fallback);
  });

  it('requires both passwords and a minimum password length', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    expect(result.current.canSubmitPwd).toBe(false);

    act(() => {
      result.current.setCurrentPwd('old-password');
      result.current.setNewPwd('short');
    });

    expect(result.current.canSubmitPwd).toBe(false);

    act(() => {
      result.current.setNewPwd('new-password-123');
    });

    expect(result.current.canSubmitPwd).toBe(true);
  });

  it('changes password and clears fields on success', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });
    mockApiPut.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.setCurrentPwd('old-password');
      result.current.setNewPwd('new-password-123');
    });

    await waitFor(() => {
      expect(result.current.currentPwd).toBe('old-password');
      expect(result.current.newPwd).toBe('new-password-123');
    });

    act(() => {
      result.current.submitPasswordChange();
    });

    await waitFor(() => {
      expect(result.current.pwdMsg).toEqual({
        type: 'success',
        text: 'Password updated',
      });
    });

    expect(mockApiPut).toHaveBeenCalledWith('/auth/me/password', {
      currentPassword: 'old-password',
      newPassword: 'new-password-123',
    });
    expect(result.current.currentPwd).toBe('');
    expect(result.current.newPwd).toBe('');
  });

  it('surfaces a password change error', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });
    mockApiPut.mockRejectedValueOnce(new Error('boom'));
    mockGetErrorMessage.mockReturnValueOnce('Current password is incorrect');

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.setCurrentPwd('wrong');
      result.current.setNewPwd('new-password-123');
    });

    await waitFor(() => {
      expect(result.current.currentPwd).toBe('wrong');
      expect(result.current.newPwd).toBe('new-password-123');
    });

    act(() => {
      result.current.submitPasswordChange();
    });

    await waitFor(() => {
      expect(result.current.pwdMsg).toEqual({
        type: 'error',
        text: 'Current password is incorrect',
      });
    });
  });
});