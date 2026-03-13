import { render, screen } from '@testing-library/react';

import RegisterPage from './RegisterPage';

const mockUseRegisterPage = jest.fn();
const mockRegisterTopNav = jest.fn();
const mockRegisterCard = jest.fn();

jest.mock('../hooks/useRegisterPage', () => ({
  useRegisterPage: () => mockUseRegisterPage(),
}));

jest.mock('../components/auth-flow/RegisterTopNav', () => ({
  RegisterTopNav: (props: unknown) => {
    mockRegisterTopNav(props);
    return <div data-testid="register-top-nav" />;
  },
}));

jest.mock('../components/auth-flow/RegisterCard', () => ({
  RegisterCard: (props: unknown) => {
    mockRegisterCard(props);
    return <div data-testid="register-card" />;
  },
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRegisterPage.mockReturnValue({
      goHome: jest.fn(),
      goLogin: jest.fn(),
    });
  });

  it('renders the register shell pieces', () => {
    render(<RegisterPage />);

    expect(screen.getByTestId('register-top-nav')).toBeInTheDocument();
    expect(screen.getByTestId('register-card')).toBeInTheDocument();
  });

  it('passes the register page view model actions to child components', () => {
    const vm = {
      goHome: jest.fn(),
      goLogin: jest.fn(),
    };

    mockUseRegisterPage.mockReturnValue(vm);

    render(<RegisterPage />);

    expect(mockRegisterTopNav).toHaveBeenCalledWith(
      expect.objectContaining({
        onBackToHome: vm.goHome,
        onGoLogin: vm.goLogin,
      }),
    );

    expect(mockRegisterCard).toHaveBeenCalledWith(
      expect.objectContaining({
        vm,
      }),
    );
  });
});