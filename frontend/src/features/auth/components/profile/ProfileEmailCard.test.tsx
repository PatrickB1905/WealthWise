import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { ProfileEmailCard } from './ProfileEmailCard';

describe('ProfileEmailCard', () => {
  it('renders content and propagates email changes', async () => {
    const user = userEvent.setup();
    const onNewEmailChange = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfileEmailCard
          newEmail="john@example.com"
          onNewEmailChange={onNewEmailChange}
          emailMsg={null}
          canSubmitEmail
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Used for login and notifications')).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/email address/i));
    await user.type(screen.getByLabelText(/email address/i), 'new@example.com');

    expect(onNewEmailChange).toHaveBeenCalled();
  });

  it('shows the banner message when present', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfileEmailCard
          newEmail="john@example.com"
          onNewEmailChange={jest.fn()}
          emailMsg={{ type: 'success', text: 'Email updated to new@example.com' }}
          canSubmitEmail
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Email updated to new@example.com')).toBeInTheDocument();
  });

  it('clears the message then submits when action button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onClearMsg = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <ProfileEmailCard
          newEmail="john@example.com"
          onNewEmailChange={jest.fn()}
          emailMsg={null}
          canSubmitEmail
          isPending={false}
          onSubmit={onSubmit}
          onClearMsg={onClearMsg}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /update email/i }));

    expect(onClearMsg).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables the action button when submission is not allowed', () => {
    render(
      <ThemeProvider theme={theme}>
        <ProfileEmailCard
          newEmail="bad"
          onNewEmailChange={jest.fn()}
          emailMsg={null}
          canSubmitEmail={false}
          isPending={false}
          onSubmit={jest.fn()}
          onClearMsg={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /update email/i })).toBeDisabled();
  });
});