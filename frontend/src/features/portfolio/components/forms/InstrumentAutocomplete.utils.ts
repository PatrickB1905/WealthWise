import type { InstrumentSearchResult } from '@features/market-data';

export function formatInstrumentInputValue(option: InstrumentSearchResult): string {
  return `${option.symbol} - ${option.name}`;
}