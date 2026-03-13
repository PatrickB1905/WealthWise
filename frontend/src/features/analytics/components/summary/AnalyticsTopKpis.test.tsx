import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { AnalyticsTopKpis } from './AnalyticsTopKpis';

describe('AnalyticsTopKpis', () => {
  it('renders summary KPI values', () => {
    renderWithProviders(
      <AnalyticsTopKpis
        summary={{
          invested: 1000,
          totalPL: 100,
          totalPLPercent: 10,
          openCount: 2,
          closedCount: 1,
        }}
        plTone="positive"
        pctTone="positive"
        money={(v) => Number(v).toFixed(2)}
        pct={(v) => Number(v).toFixed(2)}
      />,
    );

    expect(screen.getByText('Total Invested')).toBeInTheDocument();
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('Open positions: 2 • Closed positions: 1')).toBeInTheDocument();
    expect(screen.getByText('Total P/L')).toBeInTheDocument();
    expect(screen.getByText('Total Return')).toBeInTheDocument();
  });
});