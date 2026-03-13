import { render, screen } from '@testing-library/react';

import LoginPage from './LoginPage';

const mockUseLoginPage = jest.fn();
const mockLoginTopNav = jest.fn();
const mockLoginCard = jest.fn();

jest.mock('../hooks/useLoginPage', () => ({
  useLoginPage: () => mockUseLoginPage(),
}));

jest.mock('../components/auth-flow/LoginTopNav', () => ({
  LoginTopNav: (props: unknown) => {
    mockLoginTopNav(props);
    return <div data-testid="login-top-nav" />;
  },
}));

jest.mock('../components/auth-flow/LoginCard', () => ({
  LoginCard: (props: unknown) => {
    mockLoginCard(props);
    return <div data-testid="login-card" />;
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoginPage.mockReturnValue({
      goHome: jest.fn(),
      goRegister: jest.fn(),
    });
  });

  it('renders the login shell pieces', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-top-nav')).toBeInTheDocument();
    expect(screen.getByTestId('login-card')).toBeInTheDocument();
  });

  it('passes the login page view model actions to child components', () => {
    const vm = {
      goHome: jest.fn(),
      goRegister: jest.fn(),
    };

    mockUseLoginPage.mockReturnValue(vm);

    render(<LoginPage />);

    expect(mockLoginTopNav).toHaveBeenCalledWith(
      expect.objectContaining({
        onBackToHome: vm.goHome,
        onCreateAccount: vm.goRegister,
      }),
    );

    expect(mockLoginCard).toHaveBeenCalledWith(
      expect.objectContaining({
        vm,
      }),
    );
  });
});