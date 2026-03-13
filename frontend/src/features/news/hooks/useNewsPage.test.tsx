import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { useNewsPage } from './useNewsPage';

const mockPositionsGet = jest.fn();
const mockNewsGet = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@shared/lib/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockPositionsGet(...args),
  },
}));

jest.mock('../api/newsClient', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockNewsGet(...args),
  },
}));

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => mockUseAuth(),
}));

function renderUseNewsPage() {
  const queryClient = makeTestQueryClient();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(() => useNewsPage(), { wrapper });
}

describe('useNewsPage', () => {
  beforeEach(() => {
    mockPositionsGet.mockReset();
    mockNewsGet.mockReset();
    mockUseAuth.mockReset();

    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'john@example.com' },
    });
  });

  it('does not fetch positions when user is missing', () => {
    mockUseAuth.mockReturnValue({ user: null });

    const { unmount } = renderUseNewsPage();

    expect(mockPositionsGet).not.toHaveBeenCalled();
    expect(mockNewsGet).not.toHaveBeenCalled();

    unmount();
  });

  it('fetches positions, derives tickers and symbols, then fetches news', async () => {
    mockPositionsGet.mockResolvedValueOnce({
      data: [{ ticker: ' aapl ' }, { ticker: 'msft' }],
    });

    mockNewsGet.mockResolvedValueOnce({
      data: [
        {
          title: 'Apple headline',
          source: 'Reuters',
          url: 'https://example.com/a',
          publishedAt: '2026-03-10T12:00:00.000Z',
        },
      ],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.positions).toEqual([{ ticker: ' aapl ' }, { ticker: 'msft' }]);
    });

    await waitFor(() => {
      expect(result.current.articles).toHaveLength(1);
    });

    expect(mockPositionsGet).toHaveBeenCalledWith('/positions?status=open');
    expect(result.current.tickers).toEqual(['AAPL', 'MSFT']);
    expect(result.current.symbols).toBe('AAPL,MSFT');
    expect(mockNewsGet).toHaveBeenCalledWith('/news', {
      params: { symbols: 'AAPL,MSFT' },
    });

    unmount();
  });

  it('filters blank tickers before requesting news', async () => {
    mockPositionsGet.mockResolvedValueOnce({
      data: [{ ticker: '  ' }, { ticker: ' aapl ' }, { ticker: '' }],
    });

    mockNewsGet.mockResolvedValueOnce({
      data: [],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.tickers).toEqual(['AAPL']);
    });

    expect(result.current.symbols).toBe('AAPL');
    expect(mockNewsGet).toHaveBeenCalledWith('/news', {
      params: { symbols: 'AAPL' },
    });

    unmount();
  });

  it('does not fetch news when there are no symbols', async () => {
    mockPositionsGet.mockResolvedValueOnce({
      data: [],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.positions).toEqual([]);
    });

    expect(result.current.tickers).toEqual([]);
    expect(result.current.symbols).toBe('');
    expect(mockNewsGet).not.toHaveBeenCalled();

    unmount();
  });

  it('returns empty articles when news api returns an empty array', async () => {
    mockPositionsGet.mockResolvedValueOnce({
      data: [{ ticker: 'AAPL' }],
    });

    mockNewsGet.mockResolvedValueOnce({
      data: [],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.symbols).toBe('AAPL');
    });

    expect(result.current.articles).toEqual([]);

    unmount();
  });

  it('returns em dash when there is no update timestamp yet', async () => {
    mockPositionsGet.mockResolvedValueOnce({ data: [{ ticker: 'AAPL' }] });
    mockNewsGet.mockResolvedValueOnce({ data: [] });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.symbols).toBe('AAPL');
    });

    expect(typeof result.current.updatedLabel).toBe('string');

    unmount();
  });

  it('refreshes both queries with handleRefresh', async () => {
    mockPositionsGet.mockResolvedValue({
      data: [{ ticker: 'AAPL' }],
    });

    mockNewsGet.mockResolvedValue({
      data: [],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.positions).toEqual([{ ticker: 'AAPL' }]);
    });

    const positionsCalls = mockPositionsGet.mock.calls.length;
    const newsCalls = mockNewsGet.mock.calls.length;

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(mockPositionsGet.mock.calls.length).toBeGreaterThan(positionsCalls);
    expect(mockNewsGet.mock.calls.length).toBeGreaterThan(newsCalls);

    unmount();
  });

  it('handleRefresh tolerates one query failing because it uses allSettled', async () => {
    mockPositionsGet.mockResolvedValue({
      data: [{ ticker: 'AAPL' }],
    });

    mockNewsGet
      .mockResolvedValueOnce({ data: [] })
      .mockRejectedValueOnce(new Error('news failed'));

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.symbols).toBe('AAPL');
    });

    await expect(
      act(async () => {
        await result.current.handleRefresh();
      }),
    ).resolves.toBeUndefined();

    unmount();
  });

  it('exposes the auth user from useAuth', async () => {
    mockPositionsGet.mockResolvedValueOnce({
      data: [],
    });

    const { result, unmount } = renderUseNewsPage();

    await waitFor(() => {
      expect(result.current.user).toEqual({ id: 1, email: 'john@example.com' });
    });

    unmount();
  });
});