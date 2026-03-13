import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfileErrorState } from './ProfileErrorState';

describe('ProfileErrorState', () => {
  it('renders the provided error message', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfileErrorState message="Failed to load profile" />
      </ThemeProvider>,
    );

    expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
  });
});