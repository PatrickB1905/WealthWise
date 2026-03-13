import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { usePositionsPage } from './usePositionsPage';
import { openPosition } from './__mocks__/positionsFixtures';

const mockApiGet = jest.fn();
const mockApiPost = jest.fn();
const mockApiPut = jest.fn();
const mockApiDelete = jest.fn();
const mockUseQuotes = jest.fn();
const mockUsePositionWS = jest.fn();

jest.mock('@shared/lib/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
    delete: (...args: unknown[]) => mockApiDelete(...args),
  },
}));

jest.mock('@features/portfolio/hooks/usePositionWS', () => ({
  usePositionWS: () => mockUsePositionWS(),
}));

jest.mock('@features/market-data', () => ({
  useQuotes: (...args: unknown[]) => mockUseQuotes(...args),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function renderVm() {
  return renderHook(() => usePositionsPage(false), {
    wrapper: createWrapper(),
  });
}

describe('usePositionsQuoteAlert integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockApiGet.mockResolvedValue({ data: [openPosition] });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('shows quote alert after delay when quotes are missing', async () => {
    mockUseQuotes.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    expect(result.current.pricing.missingQuotes).toBe(1);
    expect(result.current.showQuoteAlert).toBe(false);

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    await waitFor(() => {
      expect(result.current.showQuoteAlert).toBe(true);
    });
  });

  it('does not show quote alert while quotes are loading', async () => {
    mockUseQuotes.mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.showQuoteAlert).toBe(false);
  });

  it('does not show quote alert in closed tab', async () => {
    mockUseQuotes.mockReturnValue({
      data: [],
      isLoading: false,
    });

    const { result } = renderVm();

    act(() => {
      result.current.setTab('closed');
    });

    await waitFor(() => {
      expect(result.current.tab).toBe('closed');
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.showQuoteAlert).toBe(false);
  });
});