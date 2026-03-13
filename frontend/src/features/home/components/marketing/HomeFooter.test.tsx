import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeFooter } from './HomeFooter';

describe('HomeFooter', () => {
  it('renders footer sections and wires actions', async () => {
    const user = userEvent.setup();
    const onNavSection = jest.fn();
    const onRegister = jest.fn();
    const onLogin = jest.fn();
    const onOpenApp = jest.fn();

    renderWithProviders(
      <HomeFooter
        year={2026}
        onNavSection={onNavSection}
        onRegister={onRegister}
        onLogin={onLogin}
        onOpenApp={onOpenApp}
      />,
    );

    expect(screen.getByText('WealthWise')).toBeInTheDocument();
    expect(screen.getByText('© 2026 WealthWise. All rights reserved.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Features' }));
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await user.click(screen.getByRole('button', { name: 'Log in' }));
    await user.click(screen.getByRole('button', { name: 'Open app' }));
    await user.click(screen.getByRole('button', { name: 'FAQ' }));

    expect(onNavSection).toHaveBeenCalledWith('features');
    expect(onNavSection).toHaveBeenCalledWith('faq');
    expect(onRegister).toHaveBeenCalledTimes(1);
    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onOpenApp).toHaveBeenCalledTimes(1);
  });
});