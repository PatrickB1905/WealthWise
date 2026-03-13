import { render, screen } from '@testing-library/react';

import NewsPage from './NewsPage';

const mockUseNewsPage = jest.fn();

jest.mock('../hooks/useNewsPage', () => ({
  useNewsPage: () => mockUseNewsPage(),
}));

jest.mock('../components/states/NewsLoading', () => ({
  __esModule: true,
  default: () => <div data-testid="news-loading" />,
}));

jest.mock('../components/feed/NewsHeader', () => ({
  __esModule: true,
  default: () => <div data-testid="news-header" />,
}));

jest.mock('../components/feed/NewsArticles', () => ({
  __esModule: true,
  default: () => <div data-testid="news-articles" />,
}));

jest.mock('../components/states/NewsEmptyState', () => ({
  __esModule: true,
  default: (props: unknown) => {
    const typed = props as { title: string; description: string; actionLabel?: string };
    return (
      <div data-testid="news-empty-state">
        {typed.title}::{typed.description}::{typed.actionLabel ?? ''}
      </div>
    );
  },
}));

jest.mock('../components/states/NewsErrorState', () => ({
  __esModule: true,
  default: (props: unknown) => {
    const typed = props as { message: string };
    return <div data-testid="news-error-state">{typed.message}</div>;
  },
}));

jest.mock('../components/feed/NewsMobileStickyRefresh', () => ({
  __esModule: true,
  default: () => <div data-testid="news-mobile-refresh" />,
}));

describe('NewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks unauthenticated users to log in', () => {
    mockUseNewsPage.mockReturnValue({
      user: null,
    });

    render(<NewsPage />);

    expect(screen.getByText('Please log in to view your portfolio news.')).toBeInTheDocument();
  });

  it('shows a spinner while positions are loading', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: true },
    });

    const { container } = render(<NewsPage />);

    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('shows a positions error state', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: { message: 'Positions failed' } },
    });

    render(<NewsPage />);

    expect(screen.getByText('Positions failed')).toBeInTheDocument();
  });

  it('shows no-open-positions empty state', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: null },
      positions: [],
    });

    render(<NewsPage />);

    expect(screen.getByTestId('news-empty-state')).toHaveTextContent('No open positions');
  });

  it('shows news loading state', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: null },
      positions: [{ ticker: 'AAPL' }],
      newsQuery: { isLoading: true },
    });

    render(<NewsPage />);

    expect(screen.getByTestId('news-loading')).toBeInTheDocument();
  });

  it('shows news error state', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: null },
      positions: [{ ticker: 'AAPL' }],
      newsQuery: { isLoading: false, error: { message: 'News failed' } },
      isRefreshing: false,
      handleRefresh: jest.fn(),
    });

    render(<NewsPage />);

    expect(screen.getByTestId('news-error-state')).toHaveTextContent('News failed');
  });

  it('shows empty headlines state when there are no articles', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: null },
      positions: [{ ticker: 'AAPL' }],
      newsQuery: { isLoading: false, error: null },
      tickers: ['AAPL'],
      symbols: 'AAPL',
      articles: [],
      updatedLabel: '2m ago',
      isRefreshing: false,
      handleRefresh: jest.fn(),
    });

    render(<NewsPage />);

    expect(screen.getByTestId('news-empty-state')).toHaveTextContent('No headlines available');
    expect(screen.getByTestId('news-mobile-refresh')).toBeInTheDocument();
  });

  it('shows populated news content when articles exist', () => {
    mockUseNewsPage.mockReturnValue({
      user: { id: 1 },
      positionsQuery: { isLoading: false, error: null },
      positions: [{ ticker: 'AAPL' }],
      newsQuery: { isLoading: false, error: null },
      tickers: ['AAPL'],
      symbols: 'AAPL',
      articles: [{ title: 'Apple headline' }],
      updatedLabel: '2m ago',
      isRefreshing: false,
      handleRefresh: jest.fn(),
    });

    render(<NewsPage />);

    expect(screen.getByTestId('news-header')).toBeInTheDocument();
    expect(screen.getByTestId('news-articles')).toBeInTheDocument();
    expect(screen.getByTestId('news-mobile-refresh')).toBeInTheDocument();
  });
});