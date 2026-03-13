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

describe('useProfilePage email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockImplementation((_err: unknown, fallback: string) => fallback);
  });

  it('returns false for invalid email submissions', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.setNewEmail('invalid-email');
    });

    expect(result.current.canSubmitEmail).toBe(false);
  });

  it('submits email updates and refetches profile on success', async () => {
    mockApiGet
      .mockResolvedValueOnce({ data: baseProfile })
      .mockResolvedValueOnce({
        data: {
          ...baseProfile,
          email: 'new@example.com',
        },
      });

    mockApiPut.mockResolvedValueOnce({
      data: { email: 'new@example.com' },
    });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile?.email).toBe('john@example.com');
    });

    act(() => {
      result.current.setNewEmail('new@example.com');
    });

    await waitFor(() => {
      expect(result.current.newEmail).toBe('new@example.com');
    });

    act(() => {
      result.current.submitEmailUpdate();
    });

    await waitFor(() => {
      expect(result.current.emailMsg).toEqual({
        type: 'success',
        text: 'Email updated to new@example.com',
      });
    });

    expect(mockApiPut).toHaveBeenCalledWith('/auth/me/email', {
      email: 'new@example.com',
    });
  });

  it('surfaces an email update error', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });
    mockApiPut.mockRejectedValueOnce(new Error('boom'));
    mockGetErrorMessage.mockReturnValueOnce('Email already taken');

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.setNewEmail('new@example.com');
    });

    await waitFor(() => {
      expect(result.current.newEmail).toBe('new@example.com');
    });

    act(() => {
      result.current.submitEmailUpdate();
    });

    await waitFor(() => {
      expect(result.current.emailMsg).toEqual({
        type: 'error',
        text: 'Email already taken',
      });
    });
  });
});