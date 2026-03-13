describe('features/market-data/index', () => {
  it('re-exports market-data API and hooks', async () => {
    const mod = await import('./index');
    const api = await import('./api/marketDataClient');
    const instrumentSearch = await import('./hooks/useInstrumentSearch');
    const quotes = await import('./hooks/useQuotes');

    expect(mod.searchInstruments).toBe(api.searchInstruments);
    expect(mod.useInstrumentSearch).toBe(instrumentSearch.useInstrumentSearch);
    expect(mod.useQuotes).toBe(quotes.useQuotes);
  });
});