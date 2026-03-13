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

describe('useProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetErrorMessage.mockImplementation((_err: unknown, fallback: string) => fallback);
  });

  it('fetches profile data and derives presentation fields', async () => {
    mockApiGet.mockResolvedValueOnce({ data: baseProfile });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    await waitFor(() => {
      expect(result.current.fullName).toBe('John Doe');
      expect(result.current.newEmail).toBe('john@example.com');
      expect(result.current.canSubmitEmail).toBe(true);
    });

    expect(mockApiGet).toHaveBeenCalledWith('/auth/me');
    expect(result.current.initialsFromName('John', 'Doe')).toBe('JD');
  });

  it('refresh triggers a refetch', async () => {
    mockApiGet.mockResolvedValue({ data: baseProfile });

    const { result } = renderHook(() => useProfilePage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.profile).toBeTruthy();
    });

    const initialCallCount = mockApiGet.mock.calls.length;

    await act(async () => {
      await result.current.refresh();
    });

    expect(mockApiGet.mock.calls.length).toBeGreaterThan(initialCallCount);
  });
});