import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { AnalyticsRiskKpis } from './AnalyticsRiskKpis';

describe('AnalyticsRiskKpis', () => {
  it('renders risk KPI values', () => {
    renderWithProviders(
      <AnalyticsRiskKpis
        risk={{
          days: 30,
          benchmark: 'SPY',
          volatilityAnnualized: 0.12,
          maxDrawdownPercent: -5,
          sharpeAnnualized: 1.2,
          beta: 1.05,
          correlation: 0.8,
        }}
        num={(v, fallback = 0) => (typeof v === 'number' ? v : fallback)}
        fixed={(v, digits, fallback = 0) =>
          (typeof v === 'number' ? v : fallback).toFixed(digits)
        }
        pct={(v) => Number(v).toFixed(2)}
      />,
    );

    expect(screen.getByText('Volatility (Annual)')).toBeInTheDocument();
    expect(screen.getByText('12.00%')).toBeInTheDocument();
    expect(screen.getByText('-5.00%')).toBeInTheDocument();
    expect(screen.getByText('1.20')).toBeInTheDocument();
    expect(screen.getByText('0.80')).toBeInTheDocument();
    expect(screen.getByText('Beta: 1.05')).toBeInTheDocument();
  });
});