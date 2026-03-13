import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@test/renderWithProviders';
import { AnalyticsControls } from './AnalyticsControls';

describe('AnalyticsControls', () => {
  it('renders benchmark, window, and freshness controls', () => {
    renderWithProviders(
      <AnalyticsControls
        benchmark="SPY"
        onBenchmarkChange={jest.fn()}
        days={30}
        onDaysChange={jest.fn()}
        updatedLabel="2m ago"
      />,
    );

    expect(screen.getByText('Benchmark')).toBeInTheDocument();
    expect(screen.getByText('Window')).toBeInTheDocument();
    expect(screen.getByText('Freshness')).toBeInTheDocument();
    expect(screen.getByText('Updated 2m ago')).toBeInTheDocument();
  });

  it('calls benchmark and days change handlers', async () => {
    const user = userEvent.setup();
    const onBenchmarkChange = jest.fn();
    const onDaysChange = jest.fn();

    renderWithProviders(
      <AnalyticsControls
        benchmark="SPY"
        onBenchmarkChange={onBenchmarkChange}
        days={30}
        onDaysChange={onDaysChange}
        updatedLabel="2m ago"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'QQQ' }));
    expect(onBenchmarkChange).toHaveBeenCalledWith('QQQ');

    await user.click(screen.getByRole('button', { name: '90D' }));
    expect(onDaysChange).toHaveBeenCalledWith(90);
  });
});