export {};

const mockCreateHttpClient = jest.fn();

jest.mock('@shared/lib/http', () => ({
  createHttpClient: (...args: unknown[]) => mockCreateHttpClient(...args),
}));

jest.mock('@shared/lib/env', () => ({
  ENV: {
    ANALYTICS_API_URL: 'https://analytics.example.com',
  },
}));

describe('analyticsClient', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('creates the analytics client from env', async () => {
    const fakeClient = { get: jest.fn() };
    mockCreateHttpClient.mockReturnValue(fakeClient);

    const mod = await import('./analyticsClient');

    expect(mockCreateHttpClient).toHaveBeenCalledWith('https://analytics.example.com');
    expect(mod.default).toBe(fakeClient);
  });
});