import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomePlansSection } from './HomePlansSection';

describe('HomePlansSection', () => {
  it('renders plan cards and register CTAs', async () => {
    const user = userEvent.setup();
    const onRegister = jest.fn();

    renderWithProviders(<HomePlansSection onRegister={onRegister} />);

    expect(screen.getByText('Flexible Plans for Every Stage')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /get started/i }));
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(onRegister).toHaveBeenCalledTimes(2);
  });
});