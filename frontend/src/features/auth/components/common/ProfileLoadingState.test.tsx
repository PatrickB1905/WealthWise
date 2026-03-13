import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfileLoadingState } from './ProfileLoadingState';

describe('ProfileLoadingState', () => {
  it('renders a progress indicator', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <ProfileLoadingState />
      </ThemeProvider>,
    );

    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });
});