import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsDesktopTable } from './PositionsDesktopTable';

const positions = [
  {
    id: 1,
    ticker: 'AAPL',
    quantity: 10,
    buyPrice: 100,
    buyDate: '2026-03-01T00:00:00.000Z',
  },
];

describe('PositionsDesktopTable', () => {
  it('renders open positions with current quote data and actions', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(
      <PositionsDesktopTable
        tab="open"
        positions={positions}
        quotesMap={{
          AAPL: {
            symbol: 'AAPL',
            currentPrice: 110,
            dailyChangePercent: 2,
            logoUrl: '',
            updatedAt: new Date().toISOString(),
          },
        }}
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 100,
          totalProfitPctKnown: 10,
          missingQuotes: 0,
        }}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('$110.00')).toBeInTheDocument();
    expect(screen.getAllByText(/10\.00\s*%/)).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledWith(positions[0]);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(positions[0]);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(positions[0]);
  });

  it('renders closed positions using sell price', () => {
    renderWithProviders(
      <PositionsDesktopTable
        tab="closed"
        positions={[
          {
            ...positions[0],
            sellPrice: 120,
            sellDate: '2026-03-10T00:00:00.000Z',
          },
        ]}
        quotesMap={{}}
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 200,
          totalProfitPctKnown: 20,
          missingQuotes: 0,
        }}
        onClose={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getAllByText(/20\.00\s*%/)).toHaveLength(2);
    expect(screen.getAllByText('$200.00')).toHaveLength(2);
  });

  it('shows totals row', () => {
    renderWithProviders(
      <PositionsDesktopTable
        tab="open"
        positions={positions}
        quotesMap={{}}
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 0,
          totalProfitPctKnown: 0,
          missingQuotes: 1,
        }}
        onClose={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Totals')).toBeInTheDocument();
    expect(screen.getAllByText('$1,000.00')).toHaveLength(2);
  });
});