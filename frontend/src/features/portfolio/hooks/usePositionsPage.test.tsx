import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { usePositionsPage } from './usePositionsPage';
import { closedPosition, defaultQuote, openPosition } from './__mocks__/positionsFixtures';

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

function renderVm(isMobile = false) {
  return renderHook(() => usePositionsPage(isMobile), {
    wrapper: createWrapper(),
  });
}

describe('usePositionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockApiGet.mockImplementation((url: string) => {
      if (url === '/positions?status=closed') {
        return Promise.resolve({ data: [closedPosition] });
      }

      return Promise.resolve({ data: [openPosition] });
    });

    mockUseQuotes.mockReturnValue({
      data: [defaultQuote],
      isLoading: false,
    });
  });

  it('loads positions and quote-derived pricing', async () => {
    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    expect(mockUsePositionWS).toHaveBeenCalled();
    expect(result.current.pricing.totalInvested).toBe(1000);
    expect(result.current.pricing.totalProfitKnown).toBe(100);
    expect(result.current.pricing.totalProfitPctKnown).toBe(10);
    expect(result.current.totalsProfitTone).toBe('positive');
    expect(result.current.totalsPctTone).toBe('positive');
    expect(result.current.headerSubtitle).toContain('Live portfolio view');
    expect(result.current.listSubtitle).toContain('Live pricing');
    expect(result.current.isMobile).toBe(false);
  });

  it('switches to closed tab and derives realized totals', async () => {
    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.setTab('closed');
    });

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith('/positions?status=closed');
    });

    await waitFor(() => {
      expect(result.current.tab).toBe('closed');
      expect(result.current.positions[0]?.ticker).toBe('MSFT');
    });

    expect(result.current.pricing.totalInvested).toBe(1000);
    expect(result.current.pricing.totalProfitKnown).toBe(100);
    expect(result.current.pricing.totalProfitPctKnown).toBe(10);
    expect(result.current.headerSubtitle).toContain('Closed trades');
    expect(result.current.listSubtitle).toContain('Sell prices');
  });

  it('returns loading while quotes are loading in open tab', async () => {
    mockUseQuotes.mockReturnValue({
      data: [],
      isLoading: true,
    });

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    expect(result.current.loading).toBe(true);
  });
});