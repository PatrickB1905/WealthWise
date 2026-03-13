import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import NewsEmptyState from './NewsEmptyState';

describe('NewsEmptyState', () => {
  it('renders custom action node when provided', () => {
    renderWithProviders(
      <NewsEmptyState
        title="No headlines available"
        description="Try again later."
        action={<button>Custom Action</button>}
      />,
    );

    expect(screen.getByText('No headlines available')).toBeInTheDocument();
    expect(screen.getByText('Try again later.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
  });

  it('renders button action when actionLabel and onAction are provided', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();

    renderWithProviders(
      <NewsEmptyState
        title="No headlines available"
        description="Try again later."
        actionLabel="Refresh"
        onAction={onAction}
      />,
    );

    await user.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});