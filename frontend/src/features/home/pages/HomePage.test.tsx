import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from './HomePage';

const mockNavigate = jest.fn();
const mockUseHomePage = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => false,
}));

jest.mock('../hooks/useHomePage', () => ({
  useHomePage: () => mockUseHomePage(),
}));

jest.mock('../components/marketing/HomeTopNav', () => ({
  HomeTopNav: (props: unknown) => {
    const typed = props as {
      onLogin: () => void;
      onNav: (id: 'features' | 'how' | 'plans' | 'faq') => void;
    };

    return (
      <div data-testid="home-top-nav">
        <button onClick={typed.onLogin}>login</button>
        <button onClick={() => typed.onNav('features')}>nav features</button>
      </div>
    );
  },
}));

jest.mock('../components/marketing/HomeHeroSection', () => ({
  HomeHeroSection: (props: unknown) => {
    const typed = props as {
      onGetStarted: () => void;
      topNav: React.ReactNode;
    };

    return (
      <div data-testid="home-hero-section">
        {typed.topNav}
        <button onClick={typed.onGetStarted}>get started</button>
      </div>
    );
  },
}));

jest.mock('../components/marketing/HomeValuePropsSection', () => ({
  HomeValuePropsSection: () => <div data-testid="home-value-props-section" />,
}));

jest.mock('../components/marketing/HomeFeaturesSection', () => ({
  HomeFeaturesSection: () => <div data-testid="home-features-section" />,
}));

jest.mock('../components/marketing/HomeHowItWorksSection', () => ({
  HomeHowItWorksSection: () => <div data-testid="home-how-it-works-section" />,
}));

jest.mock('../components/marketing/HomeTrustSection', () => ({
  HomeTrustSection: () => <div data-testid="home-trust-section" />,
}));

jest.mock('../components/marketing/HomePlansSection', () => ({
  HomePlansSection: (props: unknown) => {
    const typed = props as { onRegister: () => void };
    return (
      <div data-testid="home-plans-section">
        <button onClick={typed.onRegister}>plans register</button>
      </div>
    );
  },
}));

jest.mock('../components/marketing/HomeFaqSection', () => ({
  HomeFaqSection: () => <div data-testid="home-faq-section" />,
}));

jest.mock('../components/marketing/HomeCalloutSection', () => ({
  HomeCalloutSection: (props: unknown) => {
    const typed = props as { onRegister: () => void };
    return (
      <div data-testid="home-callout-section">
        <button onClick={typed.onRegister}>callout register</button>
      </div>
    );
  },
}));

jest.mock('../components/marketing/HomeFooter', () => ({
  HomeFooter: (props: unknown) => {
    const typed = props as {
      onRegister: () => void;
      onLogin: () => void;
      onOpenApp: () => void;
      onNavSection: (id: 'features' | 'how' | 'plans' | 'faq') => void;
      year: number;
    };

    return (
      <div data-testid="home-footer">
        <span>{typed.year}</span>
        <button onClick={typed.onRegister}>footer register</button>
        <button onClick={typed.onLogin}>footer login</button>
        <button onClick={typed.onOpenApp}>footer app</button>
        <button onClick={() => typed.onNavSection('faq')}>footer faq</button>
      </div>
    );
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseHomePage.mockReturnValue({
      styles: {
        heroTitleSx: { fontSize: 70 },
        heroTaglineSx: { fontSize: 18 },
      },
      navAnchorEl: null,
      navMenuOpen: false,
      openNavMenu: jest.fn(),
      closeNavMenu: jest.fn(),
      onNav: jest.fn(),
      onNavAndClose: jest.fn(),
    });
  });

  it('renders all home sections', () => {
    render(<HomePage />);

    expect(screen.getByTestId('home-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-top-nav')).toBeInTheDocument();
    expect(screen.getByTestId('home-value-props-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-features-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-how-it-works-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-trust-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-plans-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-faq-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-callout-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-footer')).toBeInTheDocument();
  });

  it('navigates to register, login, and app routes from actions', async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'get started' }));
    await user.click(screen.getByRole('button', { name: 'plans register' }));
    await user.click(screen.getByRole('button', { name: 'callout register' }));
    await user.click(screen.getByRole('button', { name: 'login' }));
    await user.click(screen.getByRole('button', { name: 'footer login' }));
    await user.click(screen.getByRole('button', { name: 'footer app' }));

    expect(mockNavigate).toHaveBeenCalledWith('/register');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledWith('/app/positions');
  });

  it('passes footer year', () => {
    render(<HomePage />);

    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });
});