import { renderWithProviders } from '@test/renderWithProviders';
import { AnalyticsLoading } from './AnalyticsLoading';

describe('AnalyticsLoading', () => {
  it('renders analytics loading skeletons', () => {
    const { container } = renderWithProviders(<AnalyticsLoading />);

    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
  });
});