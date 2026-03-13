import { renderWithProviders } from '@test/renderWithProviders';
import NewsLoading from './NewsLoading';

describe('NewsLoading', () => {
  it('renders skeleton news placeholders', () => {
    const { container } = renderWithProviders(<NewsLoading />);

    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
  });
});