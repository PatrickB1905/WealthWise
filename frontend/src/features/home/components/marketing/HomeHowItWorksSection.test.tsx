import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeHowItWorksSection } from './HomeHowItWorksSection';

describe('HomeHowItWorksSection', () => {
  it('renders steps', () => {
    renderWithProviders(
      <HomeHowItWorksSection
        steps={[
          { title: 'Create Account', desc: 'Start here' },
          { title: 'Add Positions', desc: 'Track holdings' },
        ]}
      />,
    );

    expect(screen.getByText('From Setup to Insight in Minutes')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Add Positions')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });
});