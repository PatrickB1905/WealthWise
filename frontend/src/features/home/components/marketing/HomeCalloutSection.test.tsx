import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeCalloutSection } from './HomeCalloutSection';

describe('HomeCalloutSection', () => {
  it('renders content and register CTA', async () => {
    const user = userEvent.setup();
    const onRegister = jest.fn();

    renderWithProviders(<HomeCalloutSection onRegister={onRegister} />);

    expect(
      screen.getByText('Ready to Take Control of Your Portfolio Intelligence?'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /get started/i }));
    expect(onRegister).toHaveBeenCalledTimes(1);
  });
});