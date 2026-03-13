import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { LoginCard } from './LoginCard';

const mockLoginForm = jest.fn();

jest.mock('./LoginForm', () => ({
  LoginForm: (props: unknown) => {
    mockLoginForm(props);
    return <div data-testid="login-form" />;
  },
}));

function renderLoginCard(vmOverrides?: Partial<React.ComponentProps<typeof LoginCard>['vm']>) {
  const vm = {
    email: '',
    setEmail: jest.fn(),
    password: '',
    setPassword: jest.fn(),
    rememberMe: true,
    setRememberMe: jest.fn(),
    showPassword: false,
    touched: { email: false, password: false },
    error: null,
    submitting: false,
    emailOk: true,
    passwordOk: true,
    canSubmit: true,
    handleSubmit: jest.fn(),
    markEmailTouched: jest.fn(),
    markPasswordTouched: jest.fn(),
    toggleShowPassword: jest.fn(),
    goHome: jest.fn(),
    goRegister: jest.fn(),
    ...vmOverrides,
  };

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <LoginCard vm={vm} />
      </MemoryRouter>
    </ThemeProvider>,
  );

  return vm;
}

describe('LoginCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders core marketing copy and login form', () => {
    renderLoginCard();

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(
      screen.getByText(/portfolio intelligence, performance analytics, and market insight/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('shows an error alert when vm.error is present', () => {
    renderLoginCard({ error: 'Invalid credentials' });

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('passes the expected props to LoginForm', () => {
    const vm = renderLoginCard({
      email: 'john@example.com',
      password: 'secret123',
      rememberMe: false,
      showPassword: true,
      canSubmit: false,
      submitting: true,
    });

    expect(mockLoginForm).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        onEmailChange: vm.setEmail,
        onEmailBlur: vm.markEmailTouched,
        emailOk: vm.emailOk,
        password: 'secret123',
        onPasswordChange: vm.setPassword,
        onPasswordBlur: vm.markPasswordTouched,
        passwordOk: vm.passwordOk,
        touched: vm.touched,
        rememberMe: false,
        onRememberMeChange: vm.setRememberMe,
        showPassword: true,
        onToggleShowPassword: vm.toggleShowPassword,
        submitting: true,
        canSubmit: false,
        onSubmit: vm.handleSubmit,
      }),
    );
  });

  it('renders the register link', () => {
    renderLoginCard();

    expect(
      screen.getByRole('link', { name: /don't have an account\? create one/i }),
    ).toBeInTheDocument();
  });
});