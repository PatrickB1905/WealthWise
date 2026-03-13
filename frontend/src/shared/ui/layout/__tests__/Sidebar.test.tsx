import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import Sidebar from '../Sidebar';

const mockUseMediaQuery = jest.fn();
const mockLogout = jest.fn();

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseMediaQuery(...args),
}));

jest.mock('@features/auth', () => ({
  __esModule: true,
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

function renderSidebar(options?: {
  initialPath?: string;
  mobileOpen?: boolean;
  onMobileClose?: jest.Mock;
  isDesktop?: boolean;
}) {
  const {
    initialPath = '/app/news',
    mobileOpen = false,
    onMobileClose = jest.fn(),
    isDesktop = true,
  } = options ?? {};

  mockUseMediaQuery.mockReturnValue(isDesktop);

  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="*"
            element={<Sidebar mobileOpen={mobileOpen} onMobileClose={onMobileClose} />}
          />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );

  return { onMobileClose };
}

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all primary navigation items', () => {
    renderSidebar({ initialPath: '/app/positions' });

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('renders the current route item', () => {
    renderSidebar({ initialPath: '/app/news' });

    expect(screen.getByText('News')).toBeInTheDocument();
  });

  it('calls onMobileClose when navigating from a nav item', async () => {
    const user = userEvent.setup();
    const { onMobileClose } = renderSidebar({
      initialPath: '/app/news',
      isDesktop: true,
    });

    await user.click(screen.getByText('Analytics'));

    expect(onMobileClose).toHaveBeenCalledTimes(1);
  });

  it('calls logout and onMobileClose when logout is clicked', async () => {
    const user = userEvent.setup();
    const { onMobileClose } = renderSidebar();

    await user.click(screen.getByText('Logout'));

    expect(onMobileClose).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('renders as temporary drawer on mobile', () => {
    renderSidebar({
      isDesktop: false,
      mobileOpen: true,
    });

    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });
});