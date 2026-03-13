import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsKpis } from './PositionsKpis';

describe('PositionsKpis', () => {
  it('renders loading skeletons when loading', () => {
    const { container } = renderWithProviders(
      <PositionsKpis
        loading
        tab="open"
        pricing={{
          totalInvested: 0,
          totalProfitKnown: 0,
          totalProfitPctKnown: 0,
          missingQuotes: 0,
        }}
        totalsProfitTone="neutral"
        totalsPctTone="neutral"
      />,
    );

    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
  });

  it('renders KPI values for open positions', () => {
    renderWithProviders(
      <PositionsKpis
        loading={false}
        tab="open"
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 150,
          totalProfitPctKnown: 15,
          missingQuotes: 2,
        }}
        totalsProfitTone="positive"
        totalsPctTone="positive"
      />,
    );

    expect(screen.getByText('Invested')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('15.00%')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders closed quote health placeholder', () => {
    renderWithProviders(
      <PositionsKpis
        loading={false}
        tab="closed"
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 150,
          totalProfitPctKnown: 15,
          missingQuotes: 0,
        }}
        totalsProfitTone="positive"
        totalsPctTone="positive"
      />,
    );

    expect(screen.getByText('Quote Health')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});