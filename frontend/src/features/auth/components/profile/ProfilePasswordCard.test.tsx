import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfilePasswordCard } from './ProfilePasswordCard';

describe('ProfilePasswordCard', () => {
  it('renders content and propagates password changes', async () => {
    const user = userEvent.setup();
    const onCurrentPwdChange = jest.fn();
    const onNewPwdChange = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfilePasswordCard
          currentPwd=""
          onCurrentPwdChange={onCurrentPwdChange}
          newPwd=""
          onNewPwdChange={onNewPwdChange}
          pwdMsg={null}
          canSubmitPwd={false}
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Minimum 8 characters recommended')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/current password/i), 'old-password');
    await user.type(screen.getByLabelText(/new password/i), 'new-password-123');

    expect(onCurrentPwdChange).toHaveBeenCalled();
    expect(onNewPwdChange).toHaveBeenCalled();
  });

  it('shows helper text for short new passwords', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfilePasswordCard
          currentPwd=""
          onCurrentPwdChange={jest.fn()}
          newPwd="short"
          onNewPwdChange={jest.fn()}
          pwdMsg={null}
          canSubmitPwd={false}
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument();
  });

  it('shows the banner message when present', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfilePasswordCard
          currentPwd=""
          onCurrentPwdChange={jest.fn()}
          newPwd=""
          onNewPwdChange={jest.fn()}
          pwdMsg={{ type: 'error', text: 'Current password is incorrect' }}
          canSubmitPwd={false}
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Current password is incorrect')).toBeInTheDocument();
  });

  it('clears the message then submits when action button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onClearMsg = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfilePasswordCard
          currentPwd="old-password"
          onCurrentPwdChange={jest.fn()}
          newPwd="new-password-123"
          onNewPwdChange={jest.fn()}
          pwdMsg={null}
          canSubmitPwd
          isPending={false}
          onSubmit={onSubmit}
          onClearMsg={onClearMsg}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /change password/i }));

    expect(onClearMsg).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the action button when pending', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfilePasswordCard
          currentPwd="old-password"
          onCurrentPwdChange={jest.fn()}
          newPwd="new-password-123"
          onNewPwdChange={jest.fn()}
          pwdMsg={null}
          canSubmitPwd
          isPending
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /updating…/i })).toBeDisabled();
  });
});