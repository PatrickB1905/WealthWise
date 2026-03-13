import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfileIdentityCardBlock } from './ProfileIdentityCard';

describe('ProfileIdentityCardBlock', () => {
  it('renders identity information', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfileIdentityCardBlock
          profile={{
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            createdAt: '2026-01-01T00:00:00.000Z',
          }}
          fullName="John Doe"
          memberSince="Jan 1, 2026"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Member since Jan 1, 2026')).toBeInTheDocument();
  });

  it('renders fallback full name placeholder when empty', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfileIdentityCardBlock
          profile={{
            id: 1,
            firstName: '',
            lastName: '',
            email: 'john@example.com',
            createdAt: '2026-01-01T00:00:00.000Z',
          }}
          fullName=""
          memberSince="Jan 1, 2026"
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});