import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import theme from '@shared/theme';
import { InstrumentAutocomplete } from './InstrumentAutocomplete';
import { formatInstrumentInputValue } from './InstrumentAutocomplete.utils';

import * as marketDataModule from '@features/market-data';
import type { InstrumentSearchResult } from '@features/market-data';

jest.mock('@features/market-data', () => ({
  __esModule: true,
  useInstrumentSearch: jest.fn(),
}));

const mockedUseInstrumentSearch = marketDataModule.useInstrumentSearch as jest.MockedFunction<
  typeof marketDataModule.useInstrumentSearch
>;

const tesla: InstrumentSearchResult = {
  symbol: 'TSLA',
  name: 'Tesla, Inc.',
  exchange: 'NASDAQ',
  assetType: 'EQUITY',
  currency: 'USD',
  logoUrl: 'https://logo.example/tsla.png',
};

const amazon: InstrumentSearchResult = {
  symbol: 'AMZN',
  name: 'Amazon.com, Inc.',
  exchange: 'NASDAQ',
  assetType: 'EQUITY',
  currency: 'USD',
  logoUrl: 'https://logo.example/amzn.png',
};

function renderComponent(overrides?: Partial<React.ComponentProps<typeof InstrumentAutocomplete>>) {
  const onInputChange = jest.fn();
  const onSelectionChange = jest.fn();

  render(
    <ThemeProvider theme={theme}>
      <InstrumentAutocomplete
        label="Ticker"
        inputValue=""
        selectedInstrument={null}
        onInputChange={onInputChange}
        onSelectionChange={onSelectionChange}
        {...overrides}
      />
    </ThemeProvider>,
  );

  return { onInputChange, onSelectionChange };
}

describe('InstrumentAutocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseInstrumentSearch.mockReturnValue({
      data: [tesla, amazon],
      isFetching: false,
    } as ReturnType<typeof marketDataModule.useInstrumentSearch>);
  });

  it('renders search results with symbol, description, and logo alt text', async () => {
    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByRole('combobox', { name: 'Ticker' });
    await user.click(input);
    await user.type(input, 'tes');

    expect(await screen.findByText('TSLA')).toBeInTheDocument();
    expect(screen.getByText('Tesla, Inc. • NASDAQ • EQUITY')).toBeInTheDocument();
    expect(screen.getByAltText('TSLA logo')).toBeInTheDocument();
  });

  it('calls selection and input handlers when a result is selected', async () => {
    const user = userEvent.setup();
    const { onInputChange, onSelectionChange } = renderComponent();

    const input = screen.getByRole('combobox', { name: 'Ticker' });
    await user.click(input);
    await user.type(input, 'amaz');

    const option = await screen.findByText('AMZN');
    await user.click(option);

    expect(onSelectionChange).toHaveBeenCalledWith(amazon);
    expect(onInputChange).toHaveBeenLastCalledWith(formatInstrumentInputValue(amazon));
  });

  it('shows the selected instrument logo in the input when a value is selected', () => {
    renderComponent({
      inputValue: formatInstrumentInputValue(tesla),
      selectedInstrument: tesla,
    });

    expect(screen.getAllByAltText('TSLA logo').length).toBeGreaterThan(0);
  });

  it('falls back gracefully when a dropdown logo fails to load', async () => {
    const user = userEvent.setup();
    renderComponent({
      inputValue: formatInstrumentInputValue(tesla),
      selectedInstrument: tesla,
    });

    const input = screen.getByRole('combobox', { name: 'Ticker' });
    await user.click(input);

    const dropdownLogo = await screen.findAllByAltText('TSLA logo');
    fireEvent.error(dropdownLogo[0]);

    await waitFor(() => {
      expect(screen.getAllByText('T').length).toBeGreaterThan(0);
    });
  });

  it('shows a loading indicator while fetching instrument results', () => {
    mockedUseInstrumentSearch.mockReturnValue({
      data: [],
      isFetching: true,
    } as ReturnType<typeof marketDataModule.useInstrumentSearch>);

    renderComponent();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows the minimum-character guidance when no search query is present', async () => {
    const user = userEvent.setup();

    mockedUseInstrumentSearch.mockReturnValue({
      data: [],
      isFetching: false,
    } as ReturnType<typeof marketDataModule.useInstrumentSearch>);

    renderComponent();

    const input = screen.getByRole('combobox', { name: 'Ticker' });
    await user.click(input);

    expect(await screen.findByText('Type at least 2 characters to search')).toBeInTheDocument();
  });
});