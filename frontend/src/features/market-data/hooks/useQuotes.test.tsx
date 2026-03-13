import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { useQuotes, __private__ } from './useQuotes';

const mockGet = jest.fn();
const mockGetSocket = jest.fn();

const fakeSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};

jest.mock('../api/marketDataClient', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

jest.mock('@shared/lib/socket', () => ({
  getSocket: () => mockGetSocket(),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useQuotes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSocket.mockReturnValue(fakeSocket);
  });

  it('does not subscribe when symbol list is empty', () => {
    renderHook(() => useQuotes([]), {
      wrapper: createWrapper(),
    });

    expect(fakeSocket.on).not.toHaveBeenCalled();
    expect(fakeSocket.emit).not.toHaveBeenCalledWith('price:subscribe', expect.anything());
  });

  it('normalizes symbols, fetches quotes, and subscribes through socket', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          symbol: 'msft',
          currentPrice: 420.5,
          dailyChangePercent: 1.2,
          logoUrl: 'https://logo/msft.png',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => useQuotes([' msft ']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        {
          symbol: 'MSFT',
          currentPrice: 420.5,
          dailyChangePercent: 1.2,
          logoUrl: 'https://logo/msft.png',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ]);
    });

    expect(mockGet).toHaveBeenCalledWith('/quotes', {
      params: { symbols: 'MSFT' },
    });

    expect(fakeSocket.on).toHaveBeenCalledWith('price:update', expect.any(Function));
    expect(fakeSocket.on).toHaveBeenCalledWith('price:snapshot', expect.any(Function));
    expect(fakeSocket.emit).toHaveBeenCalledWith('price:subscribe', { symbols: ['MSFT'] });
  });

  it('sorts symbols before subscribing', () => {
    renderHook(() => useQuotes(['MSFT', 'AAPL']), {
      wrapper: createWrapper(),
    });

    expect(fakeSocket.emit).toHaveBeenCalledWith('price:subscribe', {
      symbols: ['AAPL', 'MSFT'],
    });
  });

  it('supports a single-object API response', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 2,
        logoUrl: 'logo-a',
        updatedAt: '2026-03-10T12:00:00.000Z',
      },
    });

    const { result } = renderHook(() => useQuotes(['AAPL']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        {
          symbol: 'AAPL',
          currentPrice: 100,
          dailyChangePercent: 2,
          logoUrl: 'logo-a',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ]);
    });
  });

  it('returns an empty list when API payload is invalid', async () => {
    mockGet.mockResolvedValueOnce({
      data: null,
    });

    const { result } = renderHook(() => useQuotes(['AAPL']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('unsubscribes and detaches socket handlers on unmount', () => {
    const { unmount } = renderHook(() => useQuotes(['AAPL', 'MSFT']), {
      wrapper: createWrapper(),
    });

    unmount();

    expect(fakeSocket.emit).toHaveBeenCalledWith('price:unsubscribe', {
      symbols: ['AAPL', 'MSFT'],
    });
    expect(fakeSocket.off).toHaveBeenCalledWith('price:update', expect.any(Function));
    expect(fakeSocket.off).toHaveBeenCalledWith('price:snapshot', expect.any(Function));
  });

  it('mergeQuoteUpdate preserves existing values when update fields are invalid', () => {
    const merged = __private__.mergeQuoteUpdate(
      {
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 2,
        logoUrl: 'logo-a',
        updatedAt: '2026-03-10T12:00:00.000Z',
      },
      {
        symbol: 'AAPL',
        currentPrice: undefined,
        dailyChangePercent: undefined,
        logoUrl: '',
        updatedAt: 'not-a-date',
      },
    );

    expect(merged).toEqual({
      symbol: 'AAPL',
      currentPrice: 100,
      dailyChangePercent: 2,
      logoUrl: 'logo-a',
      updatedAt: '2026-03-10T12:00:00.000Z',
    });
  });

  it('mergeQuoteUpdate applies valid incoming values', () => {
    const merged = __private__.mergeQuoteUpdate(
      {
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 2,
        logoUrl: 'logo-a',
        updatedAt: '2026-03-10T12:00:00.000Z',
      },
      {
        symbol: 'AAPL',
        currentPrice: 111,
        dailyChangePercent: 3.5,
        logoUrl: 'logo-b',
        updatedAt: '2026-03-10T13:00:00.000Z',
      },
    );

    expect(merged).toEqual({
      symbol: 'AAPL',
      currentPrice: 111,
      dailyChangePercent: 3.5,
      logoUrl: 'logo-b',
      updatedAt: '2026-03-10T13:00:00.000Z',
    });
  });

  it('applies price:update socket updates into cached query data', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          symbol: 'AAPL',
          currentPrice: 100,
          dailyChangePercent: 1,
          logoUrl: 'logo-a',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => useQuotes(['AAPL']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.[0]?.currentPrice).toBe(100);
    });

    const handler = fakeSocket.on.mock.calls.find(([event]) => event === 'price:update')?.[1] as
      | ((updates: unknown) => void)
      | undefined;

    act(() => {
      handler?.([
        {
          symbol: 'AAPL',
          currentPrice: 111,
          dailyChangePercent: 3.5,
          logoUrl: 'logo-b',
          updatedAt: '2026-03-10T13:00:00.000Z',
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.data?.[0]).toEqual({
        symbol: 'AAPL',
        currentPrice: 111,
        dailyChangePercent: 3.5,
        logoUrl: 'logo-b',
        updatedAt: '2026-03-10T13:00:00.000Z',
      });
    });
  });

  it('applies price:snapshot socket updates into cached query data', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          symbol: 'AAPL',
          currentPrice: 100,
          dailyChangePercent: 1,
          logoUrl: 'logo-a',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => useQuotes(['AAPL']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.[0]?.currentPrice).toBe(100);
    });

    const handler = fakeSocket.on.mock.calls.find(([event]) => event === 'price:snapshot')?.[1] as
      | ((updates: unknown) => void)
      | undefined;

    act(() => {
      handler?.([
        {
          symbol: 'AAPL',
          currentPrice: 109,
          dailyChangePercent: 2.2,
          logoUrl: 'logo-c',
          updatedAt: '2026-03-10T13:30:00.000Z',
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.data?.[0]).toEqual({
        symbol: 'AAPL',
        currentPrice: 109,
        dailyChangePercent: 2.2,
        logoUrl: 'logo-c',
        updatedAt: '2026-03-10T13:30:00.000Z',
      });
    });
  });

  it('ignores malformed socket updates', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          symbol: 'AAPL',
          currentPrice: 100,
          dailyChangePercent: 1,
          logoUrl: 'logo-a',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => useQuotes(['AAPL']), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.[0]?.currentPrice).toBe(100);
    });

    const handler = fakeSocket.on.mock.calls.find(([event]) => event === 'price:update')?.[1] as
      | ((updates: unknown) => void)
      | undefined;

    act(() => {
      handler?.([
        {
          symbol: '   ',
          currentPrice: 500,
        },
        {
          symbol: 'AAPL',
          currentPrice: undefined,
          dailyChangePercent: undefined,
          logoUrl: '',
          updatedAt: 'not-a-date',
        },
      ]);
    });

    await waitFor(() => {
      expect(result.current.data?.[0]).toEqual({
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 1,
        logoUrl: 'logo-a',
        updatedAt: '2026-03-10T12:00:00.000Z',
      });
    });
  });
});