import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { LoginForm } from './LoginForm';

type Overrides = Partial<React.ComponentProps<typeof LoginForm>>;

function Harness(props: Overrides) {
  const [email, setEmail] = React.useState(props.email ?? '');
  const [password, setPassword] = React.useState(props.password ?? '');

  return (
    <ThemeProvider theme={theme}>
      <LoginForm
        email={email}
        onEmailChange={(next) => {
          props.onEmailChange?.(next);
          setEmail(next);
        }}
        onEmailBlur={props.onEmailBlur ?? jest.fn()}
        emailOk={props.emailOk ?? true}
        password={password}
        onPasswordChange={(next) => {
          props.onPasswordChange?.(next);
          setPassword(next);
        }}
        onPasswordBlur={props.onPasswordBlur ?? jest.fn()}
        passwordOk={props.passwordOk ?? true}
        touched={props.touched ?? { email: false, password: false }}
        rememberMe={props.rememberMe ?? true}
        onRememberMeChange={props.onRememberMeChange ?? jest.fn()}
        showPassword={props.showPassword ?? false}
        onToggleShowPassword={props.onToggleShowPassword ?? jest.fn()}
        submitting={props.submitting ?? false}
        canSubmit={props.canSubmit ?? true}
        onSubmit={props.onSubmit ?? jest.fn()}
      />
    </ThemeProvider>
  );
}

function renderLoginForm(overrides: Overrides = {}) {
  const handlers = {
    onEmailChange: overrides.onEmailChange ?? jest.fn(),
    onPasswordChange: overrides.onPasswordChange ?? jest.fn(),
    onEmailBlur: overrides.onEmailBlur ?? jest.fn(),
    onPasswordBlur: overrides.onPasswordBlur ?? jest.fn(),
    onRememberMeChange: overrides.onRememberMeChange ?? jest.fn(),
    onToggleShowPassword: overrides.onToggleShowPassword ?? jest.fn(),
    onSubmit: overrides.onSubmit ?? jest.fn(),
  };

  const utils = render(<Harness {...overrides} {...handlers} />);

  return { ...utils, handlers };
}

describe('LoginForm', () => {
  it('renders all core form controls', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('propagates email and password changes', async () => {
    const user = userEvent.setup();
    const { handlers } = renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'secret123');

    expect(handlers.onEmailChange).toHaveBeenCalled();
    expect(handlers.onEmailChange).toHaveBeenLastCalledWith('john@example.com');
    expect(handlers.onPasswordChange).toHaveBeenCalled();
    expect(handlers.onPasswordChange).toHaveBeenLastCalledWith('secret123');
  });

  it('shows validation helper text when touched and invalid', () => {
    renderLoginForm({
      touched: { email: true, password: true },
      emailOk: false,
      passwordOk: false,
    });

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });

  it('calls blur handlers', async () => {
    const user = userEvent.setup();
    const { handlers } = renderLoginForm();

    await user.click(screen.getByLabelText(/email/i));
    await user.tab();
    expect(handlers.onEmailBlur).toHaveBeenCalledTimes(1);

    await user.click(screen.getByLabelText(/password/i, { selector: 'input' }));
    await user.tab();
    expect(handlers.onPasswordBlur).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility via the adornment button', async () => {
    const user = userEvent.setup();
    const { handlers } = renderLoginForm({ showPassword: false });

    await user.click(screen.getByRole('button', { name: /show password/i }));

    expect(handlers.onToggleShowPassword).toHaveBeenCalledTimes(1);
  });

  it('propagates remember me checkbox changes', async () => {
    const user = userEvent.setup();
    const { handlers } = renderLoginForm({ rememberMe: false });

    await user.click(screen.getByRole('checkbox', { name: /remember me/i }));

    expect(handlers.onRememberMeChange).toHaveBeenCalledWith(true);
  });

  it('disables the submit button when submission is not allowed', () => {
    renderLoginForm({ canSubmit: false });

    expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
  });

  it('disables interactive controls while submitting', () => {
    renderLoginForm({ submitting: true, canSubmit: false });

    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeDisabled();
  });

  it('shows the submitting label when in progress', () => {
    renderLoginForm({ submitting: true });

    expect(screen.getByRole('button', { name: /logging in…/i })).toBeInTheDocument();
  });

  it('submits the form through the form element contract', () => {
    const { container, handlers } = renderLoginForm({ canSubmit: true });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    expect(handlers.onSubmit).toHaveBeenCalledTimes(1);
  });
});