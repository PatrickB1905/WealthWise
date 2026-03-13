import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { InstrumentAutocomplete } from './InstrumentAutocomplete';

const mockUseInstrumentSearch = jest.fn();

jest.mock('@features/market-data', () => ({
  useInstrumentSearch: (...args: unknown[]) => mockUseInstrumentSearch(...args),
}));

const option = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  exchange: 'NASDAQ',
  assetType: 'stock',
  currency: 'USD',
  logoUrl: 'https://logo.example/aapl.png',
};

describe('InstrumentAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInstrumentSearch.mockReturnValue({
      data: [option],
      isFetching: false,
    });
  });

  function renderComponent(overrides?: Partial<React.ComponentProps<typeof InstrumentAutocomplete>>) {
    return render(
      <ThemeProvider theme={theme}>
        <InstrumentAutocomplete
          label="Ticker"
          inputValue=""
          selectedInstrument={null}
          onInputChange={jest.fn()}
          onSelectionChange={jest.fn()}
          {...overrides}
        />
      </ThemeProvider>,
    );
  }

  it('queries using the current input value and focus-enabled search', () => {
    renderComponent({ inputValue: 'AAP' });

    expect(mockUseInstrumentSearch).toHaveBeenCalledWith('AAP', {
      enabled: false,
    });
  });

  it('shows helper text and error state', () => {
    renderComponent({
      error: true,
      helperText: 'Please select a valid ticker from the list',
    });

    expect(screen.getByText('Please select a valid ticker from the list')).toBeInTheDocument();
  });

  it('propagates typed input changes', async () => {
    const user = userEvent.setup();
    const onInputChange = jest.fn();

    renderComponent({
      onInputChange,
    });

    await user.type(screen.getByLabelText(/ticker/i), 'AA');

    expect(onInputChange).toHaveBeenCalled();
  });

  it('renders selected instrument adornment when input matches selected value', () => {
    renderComponent({
      inputValue: 'AAPL - Apple Inc.',
      selectedInstrument: option,
    });

    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('shows loading indicator when fetching', () => {
    mockUseInstrumentSearch.mockReturnValueOnce({
      data: [],
      isFetching: true,
    });

    const { container } = renderComponent({
      inputValue: 'AAP',
    });

    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });

  it('renders options after opening the popup', async () => {
    const user = userEvent.setup();
    const onSelectionChange = jest.fn();
    const onInputChange = jest.fn();

    renderComponent({
      inputValue: 'AAP',
      onSelectionChange,
      onInputChange,
    });

    const input = screen.getByLabelText(/ticker/i);
    await user.click(input);

    await waitFor(() => {
      expect(screen.getByText('Apple Inc. • NASDAQ • stock')).toBeInTheDocument();
    });
  });
});