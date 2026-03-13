import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeFeaturesSection } from './HomeFeaturesSection';

function FakeIcon() {
  return <svg data-testid="fake-icon" />;
}

describe('HomeFeaturesSection', () => {
  it('renders feature cards, highlights, and preview image', () => {
    renderWithProviders(
      <HomeFeaturesSection
        featureCards={[
          {
            title: 'Feature One',
            description: 'Feature description',
            accentIcon: { Icon: FakeIcon },
          },
        ]}
        highlights={[
          {
            title: 'Highlight One',
            desc: 'Highlight description',
            icon: { Icon: FakeIcon },
          },
        ]}
        analyticsScreenshotImg="analytics.png"
      />,
    );

    expect(screen.getByText('A Complete Portfolio Intelligence Stack')).toBeInTheDocument();
    expect(screen.getByText('Feature One')).toBeInTheDocument();
    expect(screen.getByText('Highlight One')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /portfolio preview/i })).toHaveAttribute(
      'src',
      'analytics.png',
    );
  });
});