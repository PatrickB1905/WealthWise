import { ENV } from '@shared/lib/env';
import { createHttpClient } from '@shared/lib/http';

const MarketDataAPI = createHttpClient(ENV.MARKET_DATA_API_URL);

export type InstrumentSearchResult = {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
  currency: string;
  logoUrl: string;
};

export async function searchInstruments(query: string): Promise<InstrumentSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const response = await MarketDataAPI.get('/instruments/search', {
    params: { q: trimmed, limit: 10 },
  });

  return response.data as InstrumentSearchResult[];
}

export default MarketDataAPI;
