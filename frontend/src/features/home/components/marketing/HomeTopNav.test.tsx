import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeTopNav } from './HomeTopNav';

jest.mock('@shared/ui/layout/BrandLogo', () => ({
  __esModule: true,
  default: () => <div data-testid="brand-logo" />,
}));

describe('HomeTopNav', () => {
  it('renders desktop nav and wires actions', async () => {
    const user = userEvent.setup();
    const onLogin = jest.fn();
    const onNav = jest.fn();

    renderWithProviders(
      <HomeTopNav
        isMobileNav={false}
        onLogin={onLogin}
        navAnchorEl={null}
        navMenuOpen={false}
        openNavMenu={jest.fn()}
        closeNavMenu={jest.fn()}
        onNav={onNav}
        onNavAndClose={jest.fn()}
      />,
    );

    expect(screen.getByTestId('brand-logo')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Features' }));
    await user.click(screen.getByRole('button', { name: 'How It Works' }));
    await user.click(screen.getByRole('button', { name: 'Plans' }));
    await user.click(screen.getByRole('button', { name: 'FAQ' }));
    await user.click(screen.getByText('Log in'));

    expect(onNav).toHaveBeenCalledWith('features');
    expect(onNav).toHaveBeenCalledWith('how');
    expect(onNav).toHaveBeenCalledWith('plans');
    expect(onNav).toHaveBeenCalledWith('faq');
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('renders mobile nav and opens/closes menu actions', async () => {
    const user = userEvent.setup();
    const onLogin = jest.fn();
    const openNavMenu = jest.fn();
    const onNavAndClose = jest.fn();

    renderWithProviders(
      <HomeTopNav
        isMobileNav
        onLogin={onLogin}
        navAnchorEl={document.createElement('button')}
        navMenuOpen
        openNavMenu={openNavMenu}
        closeNavMenu={jest.fn()}
        onNav={jest.fn()}
        onNavAndClose={onNavAndClose}
      />,
    );

    await user.click(screen.getByText('Log in'));
    await user.click(screen.getByLabelText(/open menu/i));

    await user.click(await screen.findByRole('menuitem', { name: 'Features' }));
    await user.click(await screen.findByRole('menuitem', { name: 'How it works' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Plans' }));
    await user.click(await screen.findByRole('menuitem', { name: 'FAQ' }));

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(openNavMenu).toHaveBeenCalledTimes(1);
    expect(onNavAndClose).toHaveBeenCalledWith('features');
    expect(onNavAndClose).toHaveBeenCalledWith('how');
    expect(onNavAndClose).toHaveBeenCalledWith('plans');
    expect(onNavAndClose).toHaveBeenCalledWith('faq');
  });
});