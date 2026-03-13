import { render, screen } from '@testing-library/react';

import AnalyticsPage from './AnalyticsPage';

const mockUseAnalyticsPage = jest.fn();

jest.mock('../hooks/useAnalyticsPage', () => ({
  useAnalyticsPage: () => mockUseAnalyticsPage(),
}));

jest.mock('../components/states/AnalyticsLoading', () => ({
  AnalyticsLoading: () => <div data-testid="analytics-loading" />,
}));

jest.mock('../components/controls/AnalyticsControls', () => ({
  AnalyticsControls: () => <div data-testid="analytics-controls" />,
}));

jest.mock('../components/summary/AnalyticsTopKpis', () => ({
  AnalyticsTopKpis: () => <div data-testid="analytics-top-kpis" />,
}));

jest.mock('../components/summary/AnalyticsRiskKpis', () => ({
  AnalyticsRiskKpis: () => <div data-testid="analytics-risk-kpis" />,
}));

jest.mock('../components/cards/ProfitHistoryCard', () => ({
  ProfitHistoryCard: () => <div data-testid="profit-history-card" />,
}));

jest.mock('../components/cards/PortfolioValueCard', () => ({
  PortfolioValueCard: () => <div data-testid="portfolio-value-card" />,
}));

jest.mock('../components/cards/HoldingsAllocationCard', () => ({
  HoldingsAllocationCard: () => <div data-testid="holdings-allocation-card" />,
}));

describe('AnalyticsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks unauthenticated users to log in', () => {
    mockUseAnalyticsPage.mockReturnValue({
      user: null,
    });

    render(<AnalyticsPage />);

    expect(screen.getByText('Please log in to view analytics.')).toBeInTheDocument();
  });

  it('shows loading state while initial data is loading', () => {
    mockUseAnalyticsPage.mockReturnValue({
      user: { id: 1 },
      anyLoading: true,
      ready: false,
    });

    render(<AnalyticsPage />);

    expect(screen.getByTestId('analytics-loading')).toBeInTheDocument();
  });

  it('shows preparing state when not ready after loading', () => {
    mockUseAnalyticsPage.mockReturnValue({
      user: { id: 1 },
      anyLoading: false,
      ready: false,
      errorMsg: '',
      benchmark: 'SPY',
      setBenchmark: jest.fn(),
      days: 30,
      setDays: jest.fn(),
      updatedLabel: '2m ago',
      summary: null,
      overview: null,
      perf: null,
      risk: null,
    });

    render(<AnalyticsPage />);

    expect(screen.getByText('Preparing your dashboard')).toBeInTheDocument();
  });

  it('shows error banner when error exists', () => {
    mockUseAnalyticsPage.mockReturnValue({
      user: { id: 1 },
      anyLoading: false,
      ready: false,
      errorMsg: 'Analytics failed',
      benchmark: 'SPY',
      setBenchmark: jest.fn(),
      days: 30,
      setDays: jest.fn(),
      updatedLabel: '2m ago',
      summary: null,
      overview: null,
      perf: null,
      risk: null,
    });

    render(<AnalyticsPage />);

    expect(screen.getByText('Analytics failed')).toBeInTheDocument();
  });

  it('renders the full analytics dashboard when ready', () => {
    mockUseAnalyticsPage.mockReturnValue({
      user: { id: 1 },
      anyLoading: false,
      ready: true,
      errorMsg: '',
      benchmark: 'SPY',
      setBenchmark: jest.fn(),
      days: 30,
      setDays: jest.fn(),
      updatedLabel: '2m ago',
      summary: {},
      overview: {},
      perf: {},
      risk: {},
      plTone: 'positive',
      pctTone: 'positive',
      money: jest.fn(),
      pct: jest.fn(),
      fixed: jest.fn(),
      num: jest.fn(),
      chart: {},
      rangeMonths: 6,
      setRangeMonths: jest.fn(),
      history: [],
      toneFromNumber: jest.fn(),
    });

    render(<AnalyticsPage />);

    expect(screen.getByTestId('analytics-controls')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-top-kpis')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-risk-kpis')).toBeInTheDocument();
    expect(screen.getByTestId('profit-history-card')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-value-card')).toBeInTheDocument();
    expect(screen.getByTestId('holdings-allocation-card')).toBeInTheDocument();
  });
});