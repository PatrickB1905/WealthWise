import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeHeroSection } from './HomeHeroSection';

describe('HomeHeroSection', () => {
  it('renders hero content and CTA', async () => {
    const user = userEvent.setup();
    const onGetStarted = jest.fn();

    renderWithProviders(
      <HomeHeroSection
        heroImg="hero.png"
        onGetStarted={onGetStarted}
        heroTitleSx={{}}
        heroTaglineSx={{}}
        topNav={<div data-testid="top-nav" />}
      />,
    );

    expect(screen.getByTestId('top-nav')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /your portfolio\.\s*one home\./i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /get started/i }));
    expect(onGetStarted).toHaveBeenCalledTimes(1);
  });
});