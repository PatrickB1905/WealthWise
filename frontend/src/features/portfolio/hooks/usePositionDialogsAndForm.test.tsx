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

describe('usePositionsPage dialogs and form', () => {
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

  it('opens and closes the add dialog with reset state', () => {
    const { result } = renderVm();

    act(() => {
      result.current.openAddDialog();
    });

    expect(result.current.addOpen).toBe(true);
    expect(result.current.newBuyDate).not.toBeNull();

    act(() => {
      result.current.closeAddDialog();
    });

    expect(result.current.addOpen).toBe(false);
    expect(result.current.tickerError).toBe('');
    expect(result.current.quantityError).toBe('');
    expect(result.current.buyPriceError).toBe('');
    expect(result.current.buyDateError).toBe('');
  });

  it('clears selected instrument when ticker text diverges', () => {
    const { result } = renderVm();

    act(() => {
      result.current.openAddDialog();
      result.current.setSelectedInstrument(msftInstrument);
    });

    expect(result.current.selectedInstrument?.symbol).toBe('MSFT');

    act(() => {
      result.current.setNewTicker('Manual text');
    });

    expect(result.current.selectedInstrument).toBeNull();
  });

  it('opens edit dialog for open positions and prepopulates fields', async () => {
    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.openEditDialog(openPosition);
    });

    expect(result.current.editOpen).toBe(true);
    expect(result.current.newQuantity).toBe('10');
    expect(result.current.newBuyPrice).toBe('100');
    expect(result.current.newBuyDate?.isValid()).toBe(true);
  });

  it('opens edit dialog for closed positions and prepopulates sell fields', async () => {
    const { result } = renderVm();

    act(() => {
      result.current.setTab('closed');
    });

    await waitFor(() => {
      expect(result.current.tab).toBe('closed');
    });

    act(() => {
      result.current.openEditDialog(closedPosition);
    });

    expect(result.current.newSellPrice).toBe('220');
    expect(result.current.newSellDate?.isValid()).toBe(true);
  });

  it('shows validation errors for invalid add state', () => {
    const { result } = renderVm();

    act(() => {
      result.current.openAddDialog();
      result.current.setSelectedInstrument(msftInstrument);
      result.current.setNewQuantity('0');
      result.current.setNewBuyPrice('');
      result.current.setNewBuyDate(null);
      result.current.onAddSubmit();
    });

    expect(result.current.quantityError).toBe('Quantity must be greater than 0');
  });

  it('shows sell date validation error during close submit', async () => {
    const { result } = renderVm();

    await waitFor(() => {
      expect(result.current.positions).toHaveLength(1);
    });

    act(() => {
      result.current.openCloseDialog(openPosition);
      result.current.setNewSellPrice('120');
      result.current.setNewSellDate(dayjs('invalid'));
      result.current.onCloseSubmit();
    });

    expect(result.current.sellDateError).toBe('Enter a valid sell date');
  });
});