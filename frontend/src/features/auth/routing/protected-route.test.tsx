import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProtectedRoute from './protected-route';

const mockUseAuth = jest.fn();

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while auth is bootstrapping', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isBootstrapping: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>secure content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading WealthWise…')).toBeInTheDocument();
    expect(
      screen.getByText('Securing your session and preparing your dashboard.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('secure content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isBootstrapping: false,
    });

    render(
      <MemoryRouter initialEntries={['/app/positions']}>
        <ProtectedRoute>
          <div>secure content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByText('secure content')).not.toBeInTheDocument();
  });

  it('renders children for authenticated users', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      isBootstrapping: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>secure content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('secure content')).toBeInTheDocument();
  });
});