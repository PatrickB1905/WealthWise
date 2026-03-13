import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { RegisterCard } from './RegisterCard';

const mockRegisterForm = jest.fn();

jest.mock('./RegisterForm', () => ({
  RegisterForm: (props: unknown) => {
    mockRegisterForm(props);
    return <div data-testid="register-form" />;
  },
}));

function renderRegisterCard(
  vmOverrides?: Partial<React.ComponentProps<typeof RegisterCard>['vm']>,
) {
  const vm = {
    firstName: '',
    setFirstName: jest.fn(),
    firstOk: false,
    lastName: '',
    setLastName: jest.fn(),
    lastOk: false,
    email: '',
    setEmail: jest.fn(),
    emailOk: false,
    password: '',
    setPassword: jest.fn(),
    passwordOk: false,
    acceptTerms: true,
    setAcceptTerms: jest.fn(),
    showPassword: false,
    toggleShowPassword: jest.fn(),
    touched: { firstName: false, lastName: false, email: false, password: false },
    markTouched: jest.fn(),
    submitting: false,
    canSubmit: false,
    handleSubmit: jest.fn(),
    error: null,
    goHome: jest.fn(),
    goLogin: jest.fn(),
    ...vmOverrides,
  };

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <RegisterCard vm={vm} />
      </MemoryRouter>
    </ThemeProvider>,
  );

  return vm;
}

describe('RegisterCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders core marketing copy and register form', () => {
    renderRegisterCard();

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(
      screen.getByText(/portfolio analytics, performance insights, and market intelligence/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('shows an error alert when vm.error is present', () => {
    renderRegisterCard({ error: 'Email already exists' });

    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });

  it('passes the expected props to RegisterForm', () => {
    const vm = renderRegisterCard({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      firstOk: true,
      lastOk: true,
      emailOk: true,
      passwordOk: true,
      acceptTerms: false,
      showPassword: true,
      submitting: true,
      canSubmit: false,
    });

    expect(mockRegisterForm).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        onFirstNameChange: vm.setFirstName,
        firstOk: true,
        lastName: 'Doe',
        onLastNameChange: vm.setLastName,
        lastOk: true,
        email: 'john@example.com',
        onEmailChange: vm.setEmail,
        emailOk: true,
        password: 'secret123',
        onPasswordChange: vm.setPassword,
        passwordOk: true,
        acceptTerms: false,
        onAcceptTermsChange: vm.setAcceptTerms,
        showPassword: true,
        onToggleShowPassword: vm.toggleShowPassword,
        touched: vm.touched,
        onBlur: vm.markTouched,
        submitting: true,
        canSubmit: false,
        onSubmit: vm.handleSubmit,
      }),
    );
  });

  it('renders the login link', () => {
    renderRegisterCard();

    expect(
      screen.getByRole('link', { name: /already have an account\? log in/i }),
    ).toBeInTheDocument();
  });
});