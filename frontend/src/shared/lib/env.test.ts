describe('shared/lib/env', () => {
  const originalEnv = process.env;
  const originalViteEnv = globalThis.__VITE_ENV__;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };

    delete process.env.VITE_POSITIONS_API_URL;
    delete process.env.VITE_MARKET_DATA_API_URL;
    delete process.env.VITE_ANALYTICS_API_URL;
    delete process.env.VITE_NEWS_API_URL;
    delete process.env.VITE_POSITIONS_WS_URL;

    delete (globalThis as { __VITE_ENV__?: Record<string, string> }).__VITE_ENV__;
  });

  afterAll(() => {
    process.env = originalEnv;
    globalThis.__VITE_ENV__ = originalViteEnv;
  });

  it('uses __VITE_ENV__ as the primary source when available', async () => {
    globalThis.__VITE_ENV__ = {
      VITE_POSITIONS_API_URL: ' https://positions.example.com ',
      VITE_MARKET_DATA_API_URL: 'https://market.example.com',
      VITE_ANALYTICS_API_URL: 'https://analytics.example.com',
      VITE_NEWS_API_URL: 'https://news.example.com',
      VITE_POSITIONS_WS_URL: ' wss://socket.example.com ',
    };

    const { ENV } = await import('./env');

    expect(ENV.POSITIONS_API_URL).toBe('https://positions.example.com');
    expect(ENV.MARKET_DATA_API_URL).toBe('https://market.example.com');
    expect(ENV.ANALYTICS_API_URL).toBe('https://analytics.example.com');
    expect(ENV.NEWS_API_URL).toBe('https://news.example.com');
    expect(ENV.POSITIONS_WS_URL).toBe('wss://socket.example.com');
  });

  it('falls back to process.env when __VITE_ENV__ is absent', async () => {
    process.env.VITE_POSITIONS_API_URL = 'https://positions.example.com';
    process.env.VITE_MARKET_DATA_API_URL = 'https://market.example.com';
    process.env.VITE_ANALYTICS_API_URL = 'https://analytics.example.com';
    process.env.VITE_NEWS_API_URL = 'https://news.example.com';
    process.env.VITE_POSITIONS_WS_URL = 'wss://socket.example.com';

    const { ENV } = await import('./env');

    expect(ENV.POSITIONS_API_URL).toBe('https://positions.example.com');
    expect(ENV.MARKET_DATA_API_URL).toBe('https://market.example.com');
    expect(ENV.ANALYTICS_API_URL).toBe('https://analytics.example.com');
    expect(ENV.NEWS_API_URL).toBe('https://news.example.com');
    expect(ENV.POSITIONS_WS_URL).toBe('wss://socket.example.com');
  });

  it('uses same-origin gateway defaults when env vars are missing', async () => {
    const { ENV } = await import('./env');

    expect(ENV.POSITIONS_API_URL).toBe('/api/positions');
    expect(ENV.MARKET_DATA_API_URL).toBe('/api/market-data');
    expect(ENV.ANALYTICS_API_URL).toBe('/api/analytics');
    expect(ENV.NEWS_API_URL).toBe('/api/news');
    expect(ENV.POSITIONS_WS_URL).toBeUndefined();
  });

  it('treats blank env values as missing and falls back appropriately', async () => {
    globalThis.__VITE_ENV__ = {
      VITE_POSITIONS_API_URL: '   ',
      VITE_MARKET_DATA_API_URL: '',
      VITE_ANALYTICS_API_URL: '   ',
      VITE_NEWS_API_URL: '',
      VITE_POSITIONS_WS_URL: '   ',
    };

    const { ENV } = await import('./env');

    expect(ENV.POSITIONS_API_URL).toBe('/api/positions');
    expect(ENV.MARKET_DATA_API_URL).toBe('/api/market-data');
    expect(ENV.ANALYTICS_API_URL).toBe('/api/analytics');
    expect(ENV.NEWS_API_URL).toBe('/api/news');
    expect(ENV.POSITIONS_WS_URL).toBeUndefined();
  });

  it('exports stable storage keys', async () => {
    const { STORAGE_KEYS } = await import('./env');

    expect(STORAGE_KEYS).toEqual({
      TOKEN: 'ww_token',
      USER: 'ww_user',
    });
  });
});