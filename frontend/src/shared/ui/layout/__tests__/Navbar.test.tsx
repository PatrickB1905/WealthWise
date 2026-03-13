import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import Navbar from '../Navbar';

const mockUseMediaQuery = jest.fn();
const mockNavigate = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseMediaQuery(...args),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => mockUseAuth(),
}));

function renderNavbar(props?: { title?: string; onMenuClick?: jest.Mock; isDesktop?: boolean }) {
  const {
    title = 'Portfolio',
    onMenuClick = jest.fn(),
    isDesktop = true,
  } = props ?? {};

  mockUseMediaQuery.mockReturnValue(isDesktop);

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Navbar title={title} onMenuClick={onMenuClick} />
      </MemoryRouter>
    </ThemeProvider>,
  );

  return { onMenuClick };
}

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });
  });

  it('renders the provided title', () => {
    renderNavbar({ title: 'Analytics' });

    expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
  });

  it('shows the menu button on mobile and calls onMenuClick', async () => {
    const user = userEvent.setup();
    const { onMenuClick } = renderNavbar({ isDesktop: false });

    await user.click(screen.getByRole('button', { name: /open sidebar/i }));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it('does not show the menu button on desktop', () => {
    renderNavbar({ isDesktop: true });

    expect(screen.queryByRole('button', { name: /open sidebar/i })).not.toBeInTheDocument();
  });

  it('shows the authenticated user email and initials', () => {
    renderNavbar();

    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('falls back to email-derived initials when names are unavailable', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: 'john.doe@example.com',
        firstName: null,
        lastName: null,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    });

    renderNavbar();

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('navigates to the profile page when the account button is clicked', async () => {
    const user = userEvent.setup();

    renderNavbar();

    await user.click(screen.getByRole('button', { name: /open profile/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/app/profile');
  });

  it('does not render account controls when no user exists', () => {
    mockUseAuth.mockReturnValue({ user: null });

    renderNavbar();

    expect(screen.queryByRole('button', { name: /open profile/i })).not.toBeInTheDocument();
  });
});