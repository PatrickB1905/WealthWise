import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';

import theme from '@shared/theme';
import { PositionDialogs } from './PositionDialogs';

jest.mock('../forms/InstrumentAutocomplete', () => ({
  InstrumentAutocomplete: (props: unknown) => {
    const typed = props as {
      helperText?: string;
      error?: boolean;
      onInputChange: (value: string) => void;
      onSelectionChange: (value: unknown) => void;
    };

    return (
      <div>
        <label htmlFor="instrument-input">Ticker</label>
        <input
          id="instrument-input"
          aria-label="Ticker"
          onChange={(e) => typed.onInputChange(e.target.value)}
        />
        <button
          onClick={() =>
            typed.onSelectionChange({
              symbol: 'AAPL',
              name: 'Apple Inc.',
              exchange: 'NASDAQ',
              assetType: 'stock',
              currency: 'USD',
              logoUrl: '',
            })
          }
        >
          select instrument
        </button>
        {typed.error ? <div>{typed.helperText}</div> : null}
      </div>
    );
  },
}));

jest.mock('@mui/x-date-pickers', () => ({
  DatePicker: (props: unknown) => {
    const typed = props as {
      label: React.ReactNode;
      onChange: (value: unknown) => void;
      slotProps?: { textField?: { helperText?: string; error?: boolean } };
    };

    return (
      <div>
        <label>{typed.label as React.ReactNode}</label>
        <button onClick={() => typed.onChange(dayjs('2026-03-11'))}>set date</button>
        {typed.slotProps?.textField?.error ? (
          <div>{typed.slotProps.textField.helperText}</div>
        ) : null}
      </div>
    );
  },
  LocalizationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: function AdapterDayjs() {
    return null;
  },
}));

function renderDialogs(overrides?: Partial<React.ComponentProps<typeof PositionDialogs>>) {
  const props: React.ComponentProps<typeof PositionDialogs> = {
    tab: 'open',
    selected: {
      id: 1,
      ticker: 'AAPL',
      quantity: 10,
      buyPrice: 100,
      buyDate: '2026-03-01T00:00:00.000Z',
    },
    addOpen: false,
    closeOpen: false,
    editOpen: false,
    deleteOpen: false,
    onCloseAdd: jest.fn(),
    onCloseClose: jest.fn(),
    onCloseEdit: jest.fn(),
    onCloseDelete: jest.fn(),
    newTicker: '',
    selectedInstrument: null,
    newQuantity: '',
    newBuyPrice: '',
    newBuyDate: dayjs('2026-03-01'),
    newSellPrice: '',
    newSellDate: dayjs('2026-03-11'),
    tickerError: '',
    quantityError: '',
    buyPriceError: '',
    buyDateError: '',
    sellPriceError: '',
    sellDateError: '',
    setNewTicker: jest.fn(),
    setSelectedInstrument: jest.fn(),
    setNewQuantity: jest.fn(),
    setNewBuyPrice: jest.fn(),
    setNewBuyDate: jest.fn(),
    setNewSellPrice: jest.fn(),
    setNewSellDate: jest.fn(),
    onAddSubmit: jest.fn(),
    onCloseSubmit: jest.fn(),
    onEditSubmit: jest.fn(),
    onDeleteConfirm: jest.fn(),
    isAdding: false,
    isClosing: false,
    isEditing: false,
    isDeleting: false,
    ...overrides,
  };

  render(
    <ThemeProvider theme={theme}>
      <PositionDialogs {...props} />
    </ThemeProvider>,
  );

  return props;
}

describe('PositionDialogs', () => {
  it('renders add dialog and wires add form actions', async () => {
    const user = userEvent.setup();
    const props = renderDialogs({ addOpen: true });

    const dialog = screen.getByRole('dialog', { name: /add new position/i });

    expect(within(dialog).getByText('Add New Position')).toBeInTheDocument();

    await user.type(within(dialog).getByLabelText('Ticker'), 'AAP');
    expect(props.setNewTicker).toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: /select instrument/i }));
    expect(props.setSelectedInstrument).toHaveBeenCalled();

    await user.type(within(dialog).getByRole('spinbutton', { name: /quantity/i }), '10');
    expect(props.setNewQuantity).toHaveBeenCalled();

    await user.type(within(dialog).getByRole('spinbutton', { name: /buy price/i }), '100');
    expect(props.setNewBuyPrice).toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: /set date/i }));
    expect(props.setNewBuyDate).toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: /^save$/i }));
    expect(props.onAddSubmit).toHaveBeenCalledTimes(1);

    await user.click(within(dialog).getByRole('button', { name: /cancel/i }));
    expect(props.onCloseAdd).toHaveBeenCalledTimes(1);
  });

  it('renders close dialog and wires close actions', async () => {
    const user = userEvent.setup();
    const props = renderDialogs({ closeOpen: true });

    const dialog = screen.getByRole('dialog', { name: /close position aapl/i });

    expect(within(dialog).getByText('Close Position AAPL')).toBeInTheDocument();

    await user.type(within(dialog).getByRole('spinbutton', { name: /sell price/i }), '120');
    expect(props.setNewSellPrice).toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: /set date/i }));
    expect(props.setNewSellDate).toHaveBeenCalled();

    await user.click(within(dialog).getByRole('button', { name: /^close$/i }));
    expect(props.onCloseSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders closed edit fields when tab is closed', () => {
    renderDialogs({ editOpen: true, tab: 'closed' });

    const dialog = screen.getByRole('dialog', { name: /edit position aapl/i });

    expect(within(dialog).getByText('Edit Position AAPL')).toBeInTheDocument();
    expect(within(dialog).getByRole('spinbutton', { name: /quantity/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('spinbutton', { name: /buy price/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('spinbutton', { name: /sell price/i })).toBeInTheDocument();
  });

  it('renders delete confirmation and wires delete actions', async () => {
    const user = userEvent.setup();
    const props = renderDialogs({ deleteOpen: true });

    const dialog = screen.getByRole('dialog', { name: /delete position aapl/i });

    expect(within(dialog).getByText('Delete Position AAPL?')).toBeInTheDocument();
    expect(
      within(dialog).getByText('This will permanently remove the position. Are you sure?'),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: /^delete$/i }));
    expect(props.onDeleteConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows pending button labels', () => {
    renderDialogs({
      addOpen: true,
      isAdding: true,
    });

    const dialog = screen.getByRole('dialog', { name: /add new position/i });

    expect(within(dialog).getByRole('button', { name: /saving…/i })).toBeDisabled();
  });
});