import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import DashboardLayout from '../DashboardLayout';
import { ROUTE_TRANSITION_MS } from '../styled.utils';

const mockNavbar = jest.fn();
const mockSidebar = jest.fn();

jest.mock('../Navbar', () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockNavbar(props);
    const typed = props as { title?: string; onMenuClick?: () => void };
    return (
      <div>
        <div data-testid="navbar-title">{typed.title}</div>
        <button onClick={typed.onMenuClick}>open-menu</button>
      </div>
    );
  },
}));

jest.mock('../Sidebar', () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockSidebar(props);
    const typed = props as { mobileOpen: boolean; onMobileClose: () => void };
    return (
      <div>
        <div data-testid="sidebar-open">{String(typed.mobileOpen)}</div>
        <button onClick={typed.onMobileClose}>close-menu</button>
      </div>
    );
  },
}));

function renderLayout(initialPath = '/app/positions') {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/app" element={<DashboardLayout />}>
            <Route path="positions" element={<div>positions page</div>} />
            <Route path="analytics" element={<div>analytics page</div>} />
            <Route path="news" element={<div>news page</div>} />
            <Route path="profile" element={<div>profile page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

function PositionsPageWithNav() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/app/profile')}>go-profile</button>
      <div>positions page</div>
    </div>
  );
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('passes the route-derived title to Navbar', () => {
    renderLayout('/app/analytics');

    expect(screen.getByTestId('navbar-title')).toHaveTextContent('Analytics');
  });

  it('renders the current route outlet content', () => {
    renderLayout('/app/news');

    expect(screen.getByText('news page')).toBeInTheDocument();
  });

  it('opens the sidebar from the navbar menu button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderLayout('/app/positions');

    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'open-menu' }));

    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('true');
  });

  it('closes the sidebar when Sidebar onMobileClose is triggered', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    renderLayout('/app/positions');

    await user.click(screen.getByRole('button', { name: 'open-menu' }));
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('true');

    await user.click(screen.getByRole('button', { name: 'close-menu' }));
    expect(screen.getByTestId('sidebar-open')).toHaveTextContent('false');
  });

  it('shows route loading progress during route transition window', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/app/positions']}>
          <Routes>
            <Route path="/app" element={<DashboardLayout />}>
              <Route path="positions" element={<PositionsPageWithNav />} />
              <Route path="profile" element={<div>profile page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByText('positions page')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'go-profile' }));

    expect(screen.getByText('profile page')).toBeInTheDocument();
    expect(container.querySelector('.MuiLinearProgress-root')).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(ROUTE_TRANSITION_MS);
    });

    expect(container.querySelector('.MuiLinearProgress-root')).toBeNull();
  });
});