import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { RegisterForm } from './RegisterForm';

type Overrides = Partial<React.ComponentProps<typeof RegisterForm>>;

function TestHarness(props: Overrides) {
  const [firstName, setFirstName] = React.useState(props.firstName ?? '');
  const [lastName, setLastName] = React.useState(props.lastName ?? '');
  const [email, setEmail] = React.useState(props.email ?? '');
  const [password, setPassword] = React.useState(props.password ?? '');
  const [acceptTerms, setAcceptTerms] = React.useState(props.acceptTerms ?? false);

  return (
    <RegisterForm
      firstName={firstName}
      onFirstNameChange={(next) => {
        props.onFirstNameChange?.(next);
        setFirstName(next);
      }}
      firstOk={props.firstOk ?? true}
      lastName={lastName}
      onLastNameChange={(next) => {
        props.onLastNameChange?.(next);
        setLastName(next);
      }}
      lastOk={props.lastOk ?? true}
      email={email}
      onEmailChange={(next) => {
        props.onEmailChange?.(next);
        setEmail(next);
      }}
      emailOk={props.emailOk ?? true}
      password={password}
      onPasswordChange={(next) => {
        props.onPasswordChange?.(next);
        setPassword(next);
      }}
      passwordOk={props.passwordOk ?? true}
      acceptTerms={acceptTerms}
      onAcceptTermsChange={(next) => {
        props.onAcceptTermsChange?.(next);
        setAcceptTerms(next);
      }}
      showPassword={props.showPassword ?? false}
      onToggleShowPassword={props.onToggleShowPassword ?? jest.fn()}
      touched={
        props.touched ?? {
          firstName: false,
          lastName: false,
          email: false,
          password: false,
        }
      }
      onBlur={props.onBlur ?? jest.fn()}
      submitting={props.submitting ?? false}
      canSubmit={props.canSubmit ?? true}
      onSubmit={props.onSubmit ?? jest.fn()}
    />
  );
}

function renderRegisterForm(overrides: Overrides = {}) {
  const handlers = {
    onFirstNameChange: (overrides.onFirstNameChange ?? jest.fn()) as jest.Mock,
    onLastNameChange: (overrides.onLastNameChange ?? jest.fn()) as jest.Mock,
    onEmailChange: (overrides.onEmailChange ?? jest.fn()) as jest.Mock,
    onPasswordChange: (overrides.onPasswordChange ?? jest.fn()) as jest.Mock,
    onAcceptTermsChange: (overrides.onAcceptTermsChange ?? jest.fn()) as jest.Mock,
    onToggleShowPassword: (overrides.onToggleShowPassword ?? jest.fn()) as jest.Mock,
    onBlur: (overrides.onBlur ?? jest.fn()) as jest.Mock,
    onSubmit: (overrides.onSubmit ?? jest.fn()) as jest.Mock,
  };

  const utils = render(
    <ThemeProvider theme={theme}>
      <TestHarness
        {...overrides}
        onFirstNameChange={handlers.onFirstNameChange}
        onLastNameChange={handlers.onLastNameChange}
        onEmailChange={handlers.onEmailChange}
        onPasswordChange={handlers.onPasswordChange}
        onAcceptTermsChange={handlers.onAcceptTermsChange}
        onToggleShowPassword={handlers.onToggleShowPassword}
        onBlur={handlers.onBlur}
        onSubmit={handlers.onSubmit}
      />
    </ThemeProvider>,
  );

  return { ...utils, handlers };
}

describe('RegisterForm', () => {
  it('renders all core form controls', () => {
    renderRegisterForm();

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /i agree to the terms & privacy policy/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('propagates all field changes', () => {
    const { handlers } = renderRegisterForm();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i, { selector: 'input' }), {
      target: { value: 'secret123' },
    });

    expect(handlers.onFirstNameChange).toHaveBeenLastCalledWith('John');
    expect(handlers.onLastNameChange).toHaveBeenLastCalledWith('Doe');
    expect(handlers.onEmailChange).toHaveBeenLastCalledWith('john@example.com');
    expect(handlers.onPasswordChange).toHaveBeenLastCalledWith('secret123');
  });

  it('calls onBlur with the correct field keys', async () => {
    const user = userEvent.setup();
    const { handlers } = renderRegisterForm();

    await user.click(screen.getByLabelText(/first name/i));
    await user.tab();
    await user.click(screen.getByLabelText(/last name/i));
    await user.tab();
    await user.click(screen.getByLabelText(/email/i));
    await user.tab();
    await user.click(screen.getByLabelText(/password/i, { selector: 'input' }));
    await user.tab();

    expect(handlers.onBlur).toHaveBeenCalledWith('firstName');
    expect(handlers.onBlur).toHaveBeenCalledWith('lastName');
    expect(handlers.onBlur).toHaveBeenCalledWith('email');
    expect(handlers.onBlur).toHaveBeenCalledWith('password');
  });

  it('shows validation helper text for touched invalid fields', () => {
    renderRegisterForm({
      touched: {
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
      firstOk: false,
      lastOk: false,
      emailOk: false,
      passwordOk: false,
    });

    expect(screen.getByText('First name is required.')).toBeInTheDocument();
    expect(screen.getByText('Last name is required.')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Use at least 8 characters.')).toBeInTheDocument();
  });

  it('toggles the terms checkbox', async () => {
    const user = userEvent.setup();
    const { handlers } = renderRegisterForm({ acceptTerms: false });

    await user.click(screen.getByRole('checkbox', { name: /i agree to the terms & privacy policy/i }));

    expect(handlers.onAcceptTermsChange).toHaveBeenCalledWith(true);
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    const { handlers } = renderRegisterForm({ showPassword: false });

    await user.click(screen.getByRole('button', { name: /show password/i }));

    expect(handlers.onToggleShowPassword).toHaveBeenCalledTimes(1);
  });

  it('disables controls while submitting', () => {
    renderRegisterForm({ submitting: true });

    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(screen.getByLabelText(/last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /i agree to the terms & privacy policy/i })).toBeDisabled();
  });

  it('disables submit when canSubmit is false', () => {
    renderRegisterForm({ canSubmit: false });

    expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled();
  });

  it('submits the form', () => {
    const { handlers, container } = renderRegisterForm({ canSubmit: true });

    const form = container.querySelector('form');
    expect(form).toBeTruthy();

    fireEvent.submit(form as HTMLFormElement);

    expect(handlers.onSubmit).toHaveBeenCalledTimes(1);
  });
});