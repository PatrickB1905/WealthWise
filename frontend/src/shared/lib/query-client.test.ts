describe('shared/lib/query-client', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('exports a query client with production-grade defaults', async () => {
    const { queryClient } = await import('./query-client');

    const defaults = queryClient.getDefaultOptions();

    expect(defaults.queries?.retry).toBe(1);
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaults.queries?.refetchOnReconnect).toBe(true);
    expect(defaults.queries?.staleTime).toBe(30_000);
    expect(defaults.queries?.gcTime).toBe(5 * 60_000);

    expect(defaults.mutations?.retry).toBe(0);
  });
});