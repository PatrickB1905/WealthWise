export const openPosition = {
  id: 1,
  ticker: 'AAPL',
  quantity: 10,
  buyPrice: 100,
  buyDate: '2026-03-01T00:00:00.000Z',
};

export const closedPosition = {
  id: 2,
  ticker: 'MSFT',
  quantity: 5,
  buyPrice: 200,
  buyDate: '2026-03-02T00:00:00.000Z',
  sellPrice: 220,
  sellDate: '2026-03-10T00:00:00.000Z',
};

export const msftInstrument = {
  symbol: 'MSFT',
  name: 'Microsoft',
  exchange: 'NASDAQ',
  assetType: 'stock',
  currency: 'USD',
  logoUrl: '',
};

export const defaultQuote = {
  symbol: 'AAPL',
  currentPrice: 110,
  dailyChangePercent: 2,
  logoUrl: '',
  updatedAt: '2026-03-10T12:00:00.000Z',
};