import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { useInstrumentSearch } from './useInstrumentSearch';

const mockSearchInstruments = jest.fn();

jest.mock('../api/marketDataClient', () => ({
  searchInstruments: (...args: unknown[]) => mockSearchInstruments(...args),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useInstrumentSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('does not query when disabled', () => {
    renderHook(() => useInstrumentSearch('AAPL', { enabled: false }), {
      wrapper: createWrapper(),
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(mockSearchInstruments).not.toHaveBeenCalled();
  });

  it('does not query when debounced input is shorter than 2 chars', () => {
    renderHook(() => useInstrumentSearch('A', { enabled: true }), {
      wrapper: createWrapper(),
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(mockSearchInstruments).not.toHaveBeenCalled();
  });

  it('queries after debounce when enabled and query is valid', async () => {
    mockSearchInstruments.mockResolvedValueOnce([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: '',
      },
    ]);

    const { result } = renderHook(() => useInstrumentSearch('  aapl  ', { enabled: true }), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();

    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(mockSearchInstruments).toHaveBeenCalledWith('aapl');
    });
  });

  it('uses previous data as placeholder while changing query', async () => {
    mockSearchInstruments.mockResolvedValueOnce([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: '',
      },
    ]);

    const { result, rerender } = renderHook(
      ({ query }) => useInstrumentSearch(query, { enabled: true }),
      {
        initialProps: { query: 'AAPL' },
        wrapper: createWrapper(),
      },
    );

    await act(async () => {
      jest.advanceTimersByTime(300);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([expect.objectContaining({ symbol: 'AAPL' })]);
    });

    mockSearchInstruments.mockResolvedValueOnce([
      {
        symbol: 'MSFT',
        name: 'Microsoft',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: '',
      },
    ]);

    rerender({ query: 'MSFT' });

    expect(result.current.data).toEqual([expect.objectContaining({ symbol: 'AAPL' })]);
  });
});