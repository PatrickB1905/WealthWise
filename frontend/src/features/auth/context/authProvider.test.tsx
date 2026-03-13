import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { AuthProvider } from './authProvider';
import { useAuth } from '../hooks/useAuth';
import { AUTH_EVENTS } from '@shared/lib/http';
import { STORAGE_KEYS } from '@shared/lib/env';

const mockNavigate = jest.fn();
const mockApiGet = jest.fn();
const mockApiPost = jest.fn();
const mockResetSocket = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@shared/lib/axios', () => ({
  __esModule: true,
  default: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
  },
}));

jest.mock('@shared/lib/socket', () => ({
  resetSocket: () => mockResetSocket(),
}));

function Probe() {
  const { user, isBootstrapping, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="bootstrapping">{String(isBootstrapping)}</div>
      <div data-testid="email">{user?.email ?? 'none'}</div>
      <button onClick={() => void login('john@example.com', 'secret123')}>login</button>
      <button onClick={() => void register('John', 'Doe', 'john@example.com', 'secret123')}>
        register
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/app/positions']}>
        <AuthProvider>
          <Probe />
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.history.pushState({}, '', '/app/positions');
  });

  it('finishes bootstrapping immediately when no token exists', async () => {
    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    expect(mockApiGet).not.toHaveBeenCalled();
    expect(screen.getByTestId('email')).toHaveTextContent('none');
  });

  it('bootstraps the current user from /auth/me when token exists', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token-123');
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: 99,
        email: 'stale@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    mockApiGet.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
        firstName: 'John',
        lastName: 'Doe',
      },
    });

    renderProvider();

    expect(screen.getByTestId('email')).toHaveTextContent('stale@example.com');

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    expect(mockApiGet).toHaveBeenCalledWith('/auth/me');
    expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toContain('john@example.com');
  });

  it('clears auth state when bootstrap request fails', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'bad-token');
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    mockApiGet.mockRejectedValueOnce(new Error('Unauthorized'));

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('email')).toHaveTextContent('none');
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(mockResetSocket).toHaveBeenCalledTimes(1);
  });

  it('persists auth and updates user on login', async () => {
    const user = userEvent.setup();

    mockApiPost.mockResolvedValueOnce({
      data: {
        token: 'login-token',
        user: {
          id: 5,
          email: 'john@example.com',
          createdAt: '2026-01-01T00:00:00.000Z',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    await user.click(screen.getByRole('button', { name: 'login' }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    });

    expect(mockApiPost).toHaveBeenCalledWith('/auth/login', {
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('login-token');
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toContain('john@example.com');
    expect(mockResetSocket).toHaveBeenCalledTimes(1);
  });

  it('persists auth and updates user on register', async () => {
    const user = userEvent.setup();

    mockApiPost.mockResolvedValueOnce({
      data: {
        token: 'register-token',
        user: {
          id: 6,
          email: 'john@example.com',
          createdAt: '2026-01-01T00:00:00.000Z',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    await user.click(screen.getByRole('button', { name: 'register' }));

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    });

    expect(mockApiPost).toHaveBeenCalledWith('/auth/register', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('register-token');
    expect(mockResetSocket).toHaveBeenCalledTimes(1);
  });

  it('logout clears auth state, resets socket, and redirects to login', async () => {
    const user = userEvent.setup();

    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token');
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    mockApiGet.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    });

    await user.click(screen.getByRole('button', { name: 'logout' }));

    expect(screen.getByTestId('email')).toHaveTextContent('none');
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(mockResetSocket).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('handles unauthorized event by clearing auth and navigating to login outside auth pages', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token');
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    );

    mockApiGet.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'john@example.com',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });

    renderProvider();

    await waitFor(() => {
      expect(screen.getByTestId('email')).toHaveTextContent('john@example.com');
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
    });

    expect(screen.getByTestId('email')).toHaveTextContent('none');
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('does not navigate on unauthorized event when already on /login', async () => {
    window.history.pushState({}, '', '/login');

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Probe />
          </AuthProvider>
        </MemoryRouter>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('bootstrapping')).toHaveTextContent('false');
    });

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});