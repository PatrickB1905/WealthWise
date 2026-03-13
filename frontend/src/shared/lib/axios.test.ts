export {};

const mockCreateHttpClient = jest.fn();

jest.mock('./http', () => ({
  createHttpClient: (...args: unknown[]) => mockCreateHttpClient(...args),
}));

jest.mock('./env', () => ({
  ENV: {
    POSITIONS_API_URL: 'https://positions.example.com',
  },
}));

describe('shared/lib/axios', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('creates the shared API client from the positions API url', async () => {
    const fakeClient = { get: jest.fn(), post: jest.fn() };
    mockCreateHttpClient.mockReturnValue(fakeClient);

    const mod = await import('./axios');

    expect(mockCreateHttpClient).toHaveBeenCalledWith('https://positions.example.com');
    expect(mod.default).toBe(fakeClient);
  });
});