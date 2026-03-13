import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { HomeFaqSection } from './HomeFaqSection';

describe('HomeFaqSection', () => {
  it('renders FAQ heading and questions', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <HomeFaqSection
        faqs={[
          {
            q: 'How does it work?',
            a: 'By combining your positions and market data.',
          },
        ]}
      />,
    );

    expect(screen.getByText('Quick Answers')).toBeInTheDocument();
    expect(screen.getByText('How does it work?')).toBeInTheDocument();

    await user.click(screen.getByText('How does it work?'));
    expect(screen.getByText('By combining your positions and market data.')).toBeInTheDocument();
  });
});