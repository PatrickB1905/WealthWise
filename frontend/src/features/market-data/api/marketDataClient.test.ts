const mockCreateHttpClient = jest.fn();
const mockGet = jest.fn();

jest.mock('@shared/lib/http', () => ({
  createHttpClient: (...args: unknown[]) => mockCreateHttpClient(...args),
}));

jest.mock('@shared/lib/env', () => ({
  ENV: {
    MARKET_DATA_API_URL: 'https://market.example.com',
  },
}));

describe('marketDataClient', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockCreateHttpClient.mockReturnValue({
      get: mockGet,
    });
  });

  it('creates the market data client from env', async () => {
    const mod = await import('./marketDataClient');

    expect(mockCreateHttpClient).toHaveBeenCalledWith('https://market.example.com');
    expect(mod.default).toBeDefined();
  });

  it('returns an empty array for queries shorter than 2 chars', async () => {
    const { searchInstruments } = await import('./marketDataClient');

    await expect(searchInstruments('a')).resolves.toEqual([]);
    await expect(searchInstruments(' ')).resolves.toEqual([]);

    expect(mockGet).not.toHaveBeenCalled();
  });

  it('trims the query and calls the search endpoint with limit 10', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          exchange: 'NASDAQ',
          assetType: 'stock',
          currency: 'USD',
          logoUrl: 'https://logo.example/aapl.png',
        },
      ],
    });

    const { searchInstruments } = await import('./marketDataClient');

    await expect(searchInstruments('  aapl  ')).resolves.toEqual([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: 'https://logo.example/aapl.png',
      },
    ]);

    expect(mockGet).toHaveBeenCalledWith('/instruments/search', {
      params: { q: 'aapl', limit: 10 },
    });
  });
});