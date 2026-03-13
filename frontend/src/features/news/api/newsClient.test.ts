export {};

const mockCreateHttpClient = jest.fn();

jest.mock('@shared/lib/http', () => ({
  createHttpClient: (...args: unknown[]) => mockCreateHttpClient(...args),
}));

jest.mock('@shared/lib/env', () => ({
  ENV: {
    NEWS_API_URL: 'https://news.example.com',
  },
}));

describe('newsClient', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('createNewsClient delegates to the provided factory', async () => {
    const { createNewsClient } = await import('./newsClient');

    const fakeClient = { get: jest.fn() };
    const factory = jest.fn().mockReturnValue(fakeClient);

    const client = createNewsClient('https://custom.example.com', factory);

    expect(factory).toHaveBeenCalledWith('https://custom.example.com');
    expect(client).toBe(fakeClient);
  });

  it('creates the default client from env at module load time', async () => {
    const fakeClient = { get: jest.fn() };
    mockCreateHttpClient.mockReturnValue(fakeClient);

    const mod = await import('./newsClient');

    expect(mockCreateHttpClient).toHaveBeenCalledWith('https://news.example.com');
    expect(mod.default).toBe(fakeClient);
  });
});