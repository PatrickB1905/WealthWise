import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsEmptyState } from './PositionsEmptyState';

describe('PositionsEmptyState', () => {
  it('renders open state with add button', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn();

    renderWithProviders(<PositionsEmptyState tab="open" onAdd={onAdd} />);

    expect(screen.getByText('No open positions yet')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add your first position/i }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('renders closed state without add button', () => {
    renderWithProviders(<PositionsEmptyState tab="closed" onAdd={jest.fn()} />);

    expect(screen.getByText('No closed positions yet')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add your first position/i })).not.toBeInTheDocument();
  });
});