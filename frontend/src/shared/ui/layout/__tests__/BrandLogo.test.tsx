import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import BrandLogo from '../BrandLogo';

describe('BrandLogo', () => {
  it('renders the marketing logo image with default alt text', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrandLogo variant="marketing" />
      </ThemeProvider>,
    );

    const img = screen.getByRole('img', { name: 'WealthWise' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-file-stub');
    expect(img).toHaveAttribute('draggable', 'false');
  });

  it('renders the sidebar variant', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrandLogo variant="sidebar" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('img', { name: 'WealthWise' })).toBeInTheDocument();
  });

  it('uses a custom alt attribute when provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrandLogo variant="marketing" alt="WealthWise brand" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('img', { name: 'WealthWise brand' })).toBeInTheDocument();
  });

  it('wraps the logo in a link when href is provided', () => {
    render(
      <ThemeProvider theme={theme}>
        <BrandLogo variant="marketing" href="/" />
      </ThemeProvider>,
    );

    expect(screen.getByRole('link', { name: 'WealthWise home' })).toHaveAttribute('href', '/');
  });
});