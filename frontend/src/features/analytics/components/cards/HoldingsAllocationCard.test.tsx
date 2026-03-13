import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { HoldingsAllocationCard } from './HoldingsAllocationCard';

describe('HoldingsAllocationCard', () => {
  it('renders empty state when there are no holdings', () => {
    renderWithProviders(
      <HoldingsAllocationCard
        overview={{
          summary: {
            invested: 1000,
            totalPL: 100,
            totalPLPercent: 10,
            openCount: 1,
            closedCount: 0,
          },
          holdings: [],
          concentration: {
            top5WeightPercent: 80,
            hhi: 0.2,
          },
        }}
        num={(v, fallback = 0) => (typeof v === 'number' ? v : fallback)}
        money={(v) => Number(v).toFixed(2)}
        pct={(v) => Number(v).toFixed(2)}
        fixed={(v, digits, fallback = 0) =>
          (typeof v === 'number' ? v : fallback).toFixed(digits)
        }
        toneFromNumber={(v) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral')}
      />,
    );

    expect(screen.getByText('No holdings yet')).toBeInTheDocument();
  });

  it('renders holdings data', () => {
    renderWithProviders(
      <HoldingsAllocationCard
        overview={{
          summary: {
            invested: 1000,
            totalPL: 100,
            totalPLPercent: 10,
            openCount: 1,
            closedCount: 0,
          },
          holdings: [
            {
              ticker: 'AAPL',
              quantity: 10,
              avgCost: 100,
              currentPrice: 110,
              marketValue: 1100,
              unrealizedPL: 100,
              unrealizedPLPercent: 10,
              weight: 50,
            },
          ],
          concentration: {
            top5WeightPercent: 80,
            hhi: 0.2,
          },
        }}
        num={(v, fallback = 0) => (typeof v === 'number' ? v : fallback)}
        money={(v) => Number(v).toFixed(2)}
        pct={(v) => Number(v).toFixed(2)}
        fixed={(v, digits, fallback = 0) =>
          (typeof v === 'number' ? v : fallback).toFixed(digits)
        }
        toneFromNumber={(v) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral')}
      />,
    );

    expect(screen.getByText('Holdings Allocation')).toBeInTheDocument();
    expect(screen.getAllByText('AAPL').length).toBeGreaterThan(0);
    expect(screen.getByText(/Concentration — Top 5 weight: 80.00% • HHI: 0.2000/i)).toBeInTheDocument();
  });
});