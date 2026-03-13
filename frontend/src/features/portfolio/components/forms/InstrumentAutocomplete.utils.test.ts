import { formatInstrumentInputValue } from './InstrumentAutocomplete.utils';

describe('InstrumentAutocomplete.utils', () => {
  it('formats instrument input value as symbol and name', () => {
    expect(
      formatInstrumentInputValue({
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: '',
      }),
    ).toBe('AAPL - Apple Inc.');
  });
});