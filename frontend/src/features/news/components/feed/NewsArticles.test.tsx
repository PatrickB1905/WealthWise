import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import NewsArticles from './NewsArticles';

describe('NewsArticles', () => {
  it('renders article rows with title, source, age, and open affordances', () => {
    renderWithProviders(
      <NewsArticles
        articles={[
          {
            title: 'Apple rises on earnings',
            source: 'Reuters',
            url: 'https://example.com/apple',
            publishedAt: new Date().toISOString(),
          },
        ]}
      />,
    );

    expect(screen.getByText('Apple rises on earnings')).toBeInTheDocument();
    expect(screen.getByText('Reuters')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/apple');
  });

  it('renders multiple articles with dividers', () => {
    const { container } = renderWithProviders(
      <NewsArticles
        articles={[
          {
            title: 'Article 1',
            source: 'Reuters',
            url: 'https://example.com/1',
            publishedAt: new Date().toISOString(),
          },
          {
            title: 'Article 2',
            source: 'Bloomberg',
            url: 'https://example.com/2',
            publishedAt: new Date().toISOString(),
          },
        ]}
      />,
    );

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(container.querySelectorAll('.MuiDivider-root').length).toBeGreaterThan(0);
  });
});