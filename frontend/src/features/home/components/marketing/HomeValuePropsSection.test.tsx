import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeValuePropsSection } from './HomeValuePropsSection';

function FakeIcon() {
  return <svg data-testid="value-icon" />;
}

describe('HomeValuePropsSection', () => {
  it('renders value proposition cards', () => {
    renderWithProviders(
      <HomeValuePropsSection
        items={[
          {
            title: 'Real-Time View',
            desc: 'See live portfolio changes.',
            icon: { Icon: FakeIcon },
          },
        ]}
      />,
    );

    expect(screen.getByText('Portfolio Intelligence Without the Noise')).toBeInTheDocument();
    expect(screen.getByText('Real-Time View')).toBeInTheDocument();
    expect(screen.getByText('See live portfolio changes.')).toBeInTheDocument();
  });
});