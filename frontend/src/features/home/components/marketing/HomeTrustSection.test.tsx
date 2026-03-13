import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeTrustSection } from './HomeTrustSection';

function FakeIcon() {
  return <svg data-testid="trust-icon" />;
}

describe('HomeTrustSection', () => {
  it('renders trust items and preview image', () => {
    renderWithProviders(
      <HomeTrustSection
        trustItems={[
          {
            title: 'Reliable Data',
            desc: 'Structured and consistent.',
            icon: { Icon: FakeIcon },
          },
        ]}
        portfolioScreenshotImg="portfolio.png"
      />,
    );

    expect(screen.getByText('Engineered for Accuracy and Consistency')).toBeInTheDocument();
    expect(screen.getByText('Reliable Data')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /news preview/i })).toHaveAttribute(
      'src',
      'portfolio.png',
    );
  });
});