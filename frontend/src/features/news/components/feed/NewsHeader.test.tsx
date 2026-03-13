import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import NewsHeader from './NewsHeader';

describe('NewsHeader', () => {
  it('renders tickers, updated label, and refresh action', () => {
    const onRefresh = jest.fn();

    renderWithProviders(
      <NewsHeader
        tickers={['AAPL', 'MSFT']}
        symbols="AAPL,MSFT"
        updatedLabel="2m ago"
        isRefreshing={false}
        onRefresh={onRefresh}
      />,
    );

    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('Updated 2m ago')).toBeInTheDocument();
    expect(screen.getByText(/Showing the latest headlines for:/i)).toBeInTheDocument();

    const refreshButton = screen.getByText('Refresh').closest('button');
    expect(refreshButton).not.toBeNull();

    fireEvent.click(refreshButton as HTMLButtonElement);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renders +more chip when tickers exceed 8', () => {
    renderWithProviders(
      <NewsHeader
        tickers={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']}
        symbols="A,B,C,D,E,F,G,H,I"
        updatedLabel="2m ago"
        isRefreshing={false}
        onRefresh={jest.fn()}
      />,
    );

    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('shows refreshing state', () => {
    renderWithProviders(
      <NewsHeader
        tickers={['AAPL']}
        symbols="AAPL"
        updatedLabel="2m ago"
        isRefreshing
        onRefresh={jest.fn()}
      />,
    );

    expect(screen.getAllByText('Refreshing…').length).toBeGreaterThan(0);
  });
});