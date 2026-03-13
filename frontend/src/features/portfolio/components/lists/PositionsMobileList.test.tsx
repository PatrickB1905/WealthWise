import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsMobileList } from './PositionsMobileList';

const position = {
  id: 1,
  ticker: 'AAPL',
  quantity: 10,
  buyPrice: 100,
  buyDate: '2026-03-01T00:00:00.000Z',
};

describe('PositionsMobileList', () => {
  it('renders open position cards and actions', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    renderWithProviders(
      <PositionsMobileList
        tab="open"
        positions={[position]}
        quotesMap={{
          AAPL: {
            symbol: 'AAPL',
            currentPrice: 110,
            dailyChangePercent: 2,
            logoUrl: '',
            updatedAt: new Date().toISOString(),
          },
        }}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getAllByText('$110.00').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledWith(position);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(position);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(position);
  });

  it('renders closed position cards with realized metrics', () => {
    renderWithProviders(
      <PositionsMobileList
        tab="closed"
        positions={[
          {
            ...position,
            sellPrice: 120,
            sellDate: '2026-03-10T00:00:00.000Z',
          },
        ]}
        quotesMap={{}}
        onClose={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Closed trade')).toBeInTheDocument();
    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toBeInTheDocument();
  });
});