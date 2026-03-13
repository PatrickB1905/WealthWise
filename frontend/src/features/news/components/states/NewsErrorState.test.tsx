import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import NewsErrorState from './NewsErrorState';

describe('NewsErrorState', () => {
  it('renders the error message and refresh action', async () => {
    const user = userEvent.setup();
    const onRefresh = jest.fn();

    renderWithProviders(
      <NewsErrorState
        message="Failed to load news"
        onRefresh={onRefresh}
        isRefreshing={false}
      />,
    );

    expect(screen.getByText('Failed to load news')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows refreshing state', () => {
    renderWithProviders(
      <NewsErrorState
        message="Failed to load news"
        onRefresh={jest.fn()}
        isRefreshing
      />,
    );

    expect(screen.getByRole('button', { name: /refreshing…/i })).toBeDisabled();
  });
});