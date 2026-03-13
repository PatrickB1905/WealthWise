import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { ProfitHistoryCard } from './ProfitHistoryCard';

describe('ProfitHistoryCard', () => {
  it('renders title, subtitle, and range controls', async () => {
    const user = userEvent.setup();
    const onRangeMonthsChange = jest.fn();

    renderWithProviders(
      <ProfitHistoryCard
        rangeMonths={6}
        onRangeMonthsChange={onRangeMonthsChange}
        history={[
          { date: '2026-03-01', value: 100 },
          { date: '2026-03-02', value: 120 },
        ]}
        chart={{
          gridStroke: '#ddd',
          axisTick: { fill: '#333', fontSize: 12, fontWeight: 600 },
          softTooltipStyle: {},
          tooltipCursor: { stroke: '#333', strokeOpacity: 0.5, strokeDasharray: '4 6' },
          primary: '#2563EB',
          textPrimary: '#111',
          areaFillId: 'ww_area_fill',
        }}
      />,
    );

    expect(screen.getByText('Profit Over Last 6 Months')).toBeInTheDocument();
    expect(screen.getByText('Rolling profit for the selected range')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '3 M' }));
    expect(onRangeMonthsChange).toHaveBeenCalledWith(3);
  });
});