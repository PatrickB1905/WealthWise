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

describe('useProfilePage delete account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockImplementation((_err: unknown, fallback: string) => fallback);
  });

  it('opens and closes the delete dialog', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.openDeleteDialog();
    });

    expect(result.current.deleteOpen).toBe(true);

    act(() => {
      result.current.closeDeleteDialog();
    });

    expect(result.current.deleteOpen).toBe(false);
  });

  it('logs the user out after successful deletion', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });
    mockApiDelete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.confirmDelete();
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    expect(mockApiDelete).toHaveBeenCalledWith('/auth/me');
  });

  it('surfaces a delete error', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });
    mockApiDelete.mockRejectedValueOnce(new Error('boom'));
    mockGetErrorMessage.mockReturnValueOnce('Failed to delete account');

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    act(() => {
      result.current.confirmDelete();
    });

    await waitFor(() => {
      expect(result.current.deleteError).toBe('Failed to delete account');
    });
  });
});