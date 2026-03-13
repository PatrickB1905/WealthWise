import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsTotalsCard } from './PositionsTotalsCard';

describe('PositionsTotalsCard', () => {
  it('renders totals summary values', () => {
    renderWithProviders(
      <PositionsTotalsCard
        pricing={{
          totalInvested: 1000,
          totalProfitKnown: 150,
          totalProfitPctKnown: 15,
          missingQuotes: 0,
        }}
      />,
    );

    expect(screen.getByText('Totals')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$150.00')).toBeInTheDocument();
    expect(screen.getByText('15.00%')).toBeInTheDocument();
  });
});