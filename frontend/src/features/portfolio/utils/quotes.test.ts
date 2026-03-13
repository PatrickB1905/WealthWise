import { ageSecondsFromIso, formatAge, quoteState } from './quotes';

describe('portfolio/utils/quotes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-11T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ageSecondsFromIso returns null for missing or invalid dates', () => {
    expect(ageSecondsFromIso()).toBeNull();
    expect(ageSecondsFromIso('not-a-date')).toBeNull();
  });

  it('ageSecondsFromIso computes elapsed seconds', () => {
    expect(ageSecondsFromIso('2026-03-11T11:59:30.000Z')).toBe(30);
  });

  it('formatAge renders seconds and minutes', () => {
    expect(formatAge(15)).toBe('15s ago');
    expect(formatAge(120)).toBe('2m ago');
  });

  it('quoteState returns missing when no quote or no price exists', () => {
    expect(quoteState()).toEqual({
      state: 'missing',
      tip: 'Live price not available yet',
    });

    expect(
      quoteState({
        symbol: 'AAPL',
        currentPrice: Number.NaN,
        dailyChangePercent: 1,
        logoUrl: '',
      }),
    ).toEqual({
      state: 'missing',
      tip: 'Live price not available yet',
    });
  });

  it('quoteState returns fresh for recent quotes', () => {
    expect(
      quoteState({
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 1,
        logoUrl: '',
        updatedAt: '2026-03-11T11:59:30.000Z',
      }),
    ).toEqual({
      state: 'fresh',
      tip: 'Updated 30s ago',
    });
  });

  it('quoteState returns stale for old quotes', () => {
    expect(
      quoteState({
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 1,
        logoUrl: '',
        updatedAt: '2026-03-11T11:58:00.000Z',
      }),
    ).toEqual({
      state: 'stale',
      tip: 'Updated 2m ago',
    });
  });

  it('quoteState returns fresh without timestamp when price exists', () => {
    expect(
      quoteState({
        symbol: 'AAPL',
        currentPrice: 100,
        dailyChangePercent: 1,
        logoUrl: '',
      }),
    ).toEqual({
      state: 'fresh',
      tip: 'Live price available',
    });
  });
});