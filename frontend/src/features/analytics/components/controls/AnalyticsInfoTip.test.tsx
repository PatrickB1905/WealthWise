import { screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { InfoTip, TitleWithTip } from './AnalyticsInfoTip';

describe('AnalyticsInfoTip', () => {
  it('renders info button with aria label', () => {
    renderWithProviders(<InfoTip title="Helpful info" ariaLabel="Benchmark info" />);

    expect(screen.getByRole('button', { name: /benchmark info/i })).toBeInTheDocument();
  });

  it('renders title with embedded info tip', () => {
    renderWithProviders(<TitleWithTip label="Total Return" tip="Return info" />);

    expect(screen.getByText('Total Return')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /total return info/i })).toBeInTheDocument();
  });
});