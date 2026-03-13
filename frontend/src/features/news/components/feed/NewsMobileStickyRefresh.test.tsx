import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import NewsMobileStickyRefresh from './NewsMobileStickyRefresh';

describe('NewsMobileStickyRefresh', () => {
  it('renders refresh button and triggers callback', async () => {
    const user = userEvent.setup();
    const onRefresh = jest.fn();

    renderWithProviders(
      <NewsMobileStickyRefresh onRefresh={onRefresh} isRefreshing={false} />,
    );

    await user.click(screen.getByRole('button', { name: /refresh headlines/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders disabled refreshing state', () => {
    renderWithProviders(
      <NewsMobileStickyRefresh onRefresh={jest.fn()} isRefreshing />,
    );

    expect(screen.getByRole('button', { name: /refreshing…/i })).toBeDisabled();
  });
});