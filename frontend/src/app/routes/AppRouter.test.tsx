import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AppRouter from './AppRouter';

jest.mock('@features/home', () => ({
  HomePage: () => <div>home page</div>,
}));

jest.mock('@features/auth', () => ({
  LoginPage: () => <div>login page</div>,
  RegisterPage: () => <div>register page</div>,
  ProfilePage: () => <div>profile page</div>,
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@features/analytics', () => ({
  AnalyticsPage: () => <div>analytics page</div>,
}));

jest.mock('@features/news', () => ({
  NewsPage: () => <div>news page</div>,
}));

jest.mock('@features/portfolio', () => ({
  PositionsPage: () => <div>positions page</div>,
}));

jest.mock('@shared/ui/layout/DashboardLayout', () => ({
  __esModule: true,
  default: () => <div>dashboard layout</div>,
}));

function renderRouter(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>,
  );
}

describe('AppRouter', () => {
  it('renders the home route', () => {
    renderRouter('/');

    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('renders the login route', () => {
    renderRouter('/login');

    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('renders the register route', () => {
    renderRouter('/register');

    expect(screen.getByText('register page')).toBeInTheDocument();
  });

  it('renders protected app shell route', () => {
    renderRouter('/app');

    expect(screen.getByText('dashboard layout')).toBeInTheDocument();
  });
});