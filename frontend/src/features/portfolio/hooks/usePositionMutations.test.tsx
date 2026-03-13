import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { makeTestQueryClient } from '@test/testQueryClient';
import { usePositionsPage } from './usePositionsPage';
import { closedPosition, defaultQuote, msftInstrument, openPosition } from './__mocks__/positionsFixtures';

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

describe('usePositionsPage mutations', () => {
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

  it('submits add position when form is valid', async () => {
    mockApiPost.mockResolvedValueOnce({
      data: {
        ...openPosition,
        ticker: 'MSFT',
      },
    });

    const { result } = renderVm();

    act(() => {
      result.current.openAddDialog();
    });

    act(() => {
      result.current.setSelectedInstrument(msftInstrument);
      result.current.setNewQuantity('5');
      result.current.setNewBuyPrice('200');
      result.current.setNewBuyDate(dayjs('2026-03-10'));
    });

    await waitFor(() => {
      expect(result.current.selectedInstrument?.symbol).toBe('MSFT');
      expect(result.current.newQuantity).toBe('5');
      expect(result.current.newBuyPrice).toBe('200');
    });

    act(() => {
      result.current.onAddSubmit();
    });

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/positions', {
        ticker: 'MSFT',
        quantity: 5,
        buyPrice: 200,
        buyDate: expect.any(String),
      });
    });

    await waitFor(() => {
      expect(result.current.toast).toEqual({
        open: true,
        message: 'Added MSFT to your portfolio.',
        severity: 'success',
      });
    });
  });

  it('shows ticker-specific api detail on add mutation error', async () => {
    mockApiPost.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Ticker already exists',
        },
      },
    });

    const { result } = renderVm();

    act(() => {
      result.current.openAddDialog();
    });

    act(() => {
      result.current.setSelectedInstrument(msftInstrument);
      result.current.setNewQuantity('5');
      result.current.setNewBuyPrice('200');
      result.current.setNewBuyDate(dayjs('2026-03-10'));
    });

    await waitFor(() => {
      expect(result.current.selectedInstrument?.symbol).toBe('MSFT');
    });

    act(() => {
      result.current.onAddSubmit();
    });

    await waitFor(() => {
      expect(result.current.tickerError).toBe('Ticker already exists');
    });

    expect(result.current.toast).toEqual({
      open: true,
      message: 'Ticker already exists',
      severity: 'error',
    });
  });

  it('submits close position when valid', async () => {
    mockApiPut.mockResolvedValueOnce({
      data: {
        ...openPosition,
        sellPrice: 120,
        sellDate: '2026-03-11T00:00:00.000Z',
      },
    });

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.openCloseDialog(openPosition);
    });

    act(() => {
      result.current.setNewSellPrice('120');
      result.current.setNewSellDate(dayjs('2026-03-11'));
    });

    await waitFor(() => {
      expect(result.current.newSellPrice).toBe('120');
    });

    act(() => {
      result.current.onCloseSubmit();
    });

    await waitFor(() => {
      expect(mockApiPut).toHaveBeenCalledWith('/positions/1/close', {
        sellPrice: 120,
        sellDate: expect.any(String),
      });
    });

    await waitFor(() => {
      expect(result.current.toast).toEqual({
        open: true,
        message: 'Closed AAPL successfully.',
        severity: 'success',
      });
    });
  });

  it('submits open edit when valid', async () => {
    mockApiPut.mockResolvedValueOnce({
      data: {
        ...openPosition,
        quantity: 12,
        buyPrice: 101,
      },
    });

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.openEditDialog(openPosition);
    });

    act(() => {
      result.current.setNewQuantity('12');
      result.current.setNewBuyPrice('101');
      result.current.setNewBuyDate(dayjs('2026-03-05'));
    });

    await waitFor(() => {
      expect(result.current.newQuantity).toBe('12');
      expect(result.current.newBuyPrice).toBe('101');
    });

    act(() => {
      result.current.onEditSubmit();
    });

    await waitFor(() => {
      expect(mockApiPut).toHaveBeenCalledWith('/positions/1', {
        id: 1,
        quantity: 12,
        buyPrice: 101,
        buyDate: expect.any(String),
      });
    });
  });

  it('opens delete dialog and confirms deletion', async () => {
    mockApiDelete.mockResolvedValueOnce(undefined);

    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.openDeleteDialog(openPosition);
    });

    await waitFor(() => {
      expect(result.current.selected?.id).toBe(1);
      expect(result.current.deleteOpen).toBe(true);
    });

    act(() => {
      result.current.onDeleteConfirm();
    });

    await waitFor(() => {
      expect(mockApiDelete).toHaveBeenCalledWith('/positions/1');
    });

    await waitFor(() => {
      expect(result.current.toast).toEqual({
        open: true,
        message: 'Deleted AAPL successfully.',
        severity: 'success',
      });
    });
  });
});