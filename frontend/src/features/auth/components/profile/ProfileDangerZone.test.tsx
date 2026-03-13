import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfileDangerZone } from './ProfileDangerZone';

describe('ProfileDangerZone', () => {
  it('renders warning copy and triggers delete intent', async () => {
    const user = userEvent.setup();
    const onDeleteClick = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfileDangerZone onDeleteClick={onDeleteClick} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Danger zone')).toBeInTheDocument();
    expect(
      screen.getByText('Permanently delete your account and all associated data.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete account/i }));

    expect(onDeleteClick).toHaveBeenCalledTimes(1);
  });
});