import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { PortfolioValueCard } from './PortfolioValueCard';

describe('PortfolioValueCard', () => {
  it('renders chart card heading and selected window', () => {
    renderWithProviders(
      <PortfolioValueCard
        days={30}
        perf={{
          days: 30,
          points: [
            { date: '2026-03-01', portfolioValue: 1000, cumulativeReturnPercent: 0 },
            { date: '2026-03-02', portfolioValue: 1010, cumulativeReturnPercent: 1 },
          ],
        }}
        chart={{
          gridStroke: '#ddd',
          axisTick: { fill: '#333', fontSize: 12, fontWeight: 600 },
          softTooltipStyle: {},
          tooltipCursor: { stroke: '#333', strokeOpacity: 0.5, strokeDasharray: '4 6' },
          primary: '#2563EB',
          textPrimary: '#111',
        }}
      />,
    );

    expect(screen.getByText('Portfolio Value (30D)')).toBeInTheDocument();
    expect(screen.getByText('Value series for the selected window')).toBeInTheDocument();
  });
});