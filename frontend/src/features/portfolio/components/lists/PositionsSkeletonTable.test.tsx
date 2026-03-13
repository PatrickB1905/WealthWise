import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsSkeletonTable } from './PositionsSkeletonTable';

describe('PositionsSkeletonTable', () => {
  it('renders loading table skeletons', () => {
    const { container } = renderWithProviders(<PositionsSkeletonTable />);

    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
  });
});