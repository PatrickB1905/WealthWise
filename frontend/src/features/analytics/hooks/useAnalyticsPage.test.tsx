import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { makeTestQueryClient } from '@test/testQueryClient';
import { useAnalyticsPage } from './useAnalyticsPage';

const mockGet = jest.fn();
const mockUseAuth = jest.fn();
const mockUsePositionWS = jest.fn();

jest.mock('../api/analyticsClient', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => mockUseAuth(),
}));

jest.mock('@features/portfolio/hooks/usePositionWS', () => ({
  usePositionWS: () => mockUsePositionWS(),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </QueryClientProvider>
    );
  };
}

describe('useAnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'john@example.com' },
    });
  });

  it('does not run analytics queries when user is missing', () => {
    mockUseAuth.mockReturnValue({ user: null });

    renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    expect(mockGet).not.toHaveBeenCalled();
  });

  it('calls usePositionWS and fetches all analytics endpoints', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          invested: 1000,
          totalPL: 100,
          totalPLPercent: 10,
          openCount: 2,
          closedCount: 1,
        },
      })
      .mockResolvedValueOnce({
        data: [{ date: '2026-03-10', value: 1100 }],
      })
      .mockResolvedValueOnce({
        data: {
          summary: {},
          holdings: [],
          concentration: { top5WeightPercent: 80, hhi: 0.2 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          days: 30,
          points: [],
        },
      })
      .mockResolvedValueOnce({
        data: {
          days: 30,
          benchmark: 'SPY',
          volatilityAnnualized: 12,
          maxDrawdownPercent: -5,
          sharpeAnnualized: 1.2,
          beta: 1,
          correlation: 0.8,
        },
      });

    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(mockUsePositionWS).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalledWith('/analytics/summary');
    expect(mockGet).toHaveBeenCalledWith('/analytics/history', {
      params: { months: 12 },
    });
    expect(mockGet).toHaveBeenCalledWith('/analytics/overview');
    expect(mockGet).toHaveBeenCalledWith('/analytics/performance', {
      params: { days: 30 },
    });
    expect(mockGet).toHaveBeenCalledWith('/analytics/risk', {
      params: { days: 30, benchmark: 'SPY' },
    });
  });

  it('derives tones and formatting helpers correctly', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          invested: 1000,
          totalPL: -50,
          totalPLPercent: 0,
          openCount: 1,
          closedCount: 0,
        },
      })
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: {
          summary: {},
          holdings: [],
          concentration: { top5WeightPercent: 80, hhi: 0.2 },
        },
      })
      .mockResolvedValueOnce({
        data: { days: 30, points: [] },
      })
      .mockResolvedValueOnce({
        data: {
          days: 30,
          benchmark: 'SPY',
          volatilityAnnualized: 12,
          maxDrawdownPercent: -5,
          sharpeAnnualized: 1.2,
          beta: 1,
          correlation: 0.8,
        },
      });

    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.plTone).toBe('negative');
    expect(result.current.pctTone).toBe('neutral');
    expect(result.current.money(12.345)).toBe('12.35');
    expect(result.current.pct(12.345)).toBe('12.35');
    expect(result.current.fixed(12.3456, 3)).toBe('12.346');
    expect(result.current.toneFromNumber(1)).toBe('positive');
    expect(result.current.toneFromNumber(0)).toBe('neutral');
    expect(result.current.toneFromNumber(-1)).toBe('negative');
  });

  it('allows control updates', () => {
    const { result } = renderHook(() => useAnalyticsPage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setRangeMonths(12);
      result.current.setDays(90);
      result.current.setBenchmark('QQQ');
    });

    expect(result.current.rangeMonths).toBe(12);
    expect(result.current.days).toBe(90);
    expect(result.current.benchmark).toBe('QQQ');
  });
});