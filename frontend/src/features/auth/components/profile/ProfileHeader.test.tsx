import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import theme from '@shared/theme';
import { ProfileHeader } from './ProfileHeader';

jest.mock('@mui/material/useMediaQuery');

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('ProfileHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders header content and triggers refresh', async () => {
    const user = userEvent.setup();
    const onRefresh = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfileHeader initials="JD" updatedLabel="2m ago" onRefresh={onRefresh} />
      </ThemeProvider>,
    );

    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Account details and security settings')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText(/updated/i)).toBeInTheDocument();
    expect(screen.getByText(/2m ago/i)).toBeInTheDocument();

    const refreshButton = screen.getByText('Refresh').closest('button');
    expect(refreshButton).toBeInTheDocument();

    await user.click(refreshButton as HTMLButtonElement);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});