import { calculatePricing, getPositionsCopy } from './usePositionsPricing';
import { closedPosition, openPosition } from './__mocks__/positionsFixtures';

describe('usePositionsPricing', () => {
  it('calculates open position pricing from live quotes', () => {
    const pricing = calculatePricing({
      positions: [openPosition],
      quotesMap: {
        AAPL: {
          symbol: 'AAPL',
          currentPrice: 110,
          dailyChangePercent: 2,
          logoUrl: '',
          updatedAt: '2026-03-10T12:00:00.000Z',
        },
      },
      tab: 'open',
    });

    expect(pricing.totalInvested).toBe(1000);
    expect(pricing.totalProfitKnown).toBe(100);
    expect(pricing.totalProfitPctKnown).toBe(10);
    expect(pricing.missingQuotes).toBe(0);
  });

  it('calculates closed position pricing from sell price', () => {
    const pricing = calculatePricing({
      positions: [closedPosition],
      quotesMap: {},
      tab: 'closed',
    });

    expect(pricing.totalInvested).toBe(1000);
    expect(pricing.totalProfitKnown).toBe(100);
    expect(pricing.totalProfitPctKnown).toBe(10);
  });

  it('falls back to buy price when closed sell price is missing', () => {
    const pricing = calculatePricing({
      positions: [
        {
          ...closedPosition,
          sellPrice: undefined,
        },
      ],
      quotesMap: {},
      tab: 'closed',
    });

    expect(pricing.totalProfitKnown).toBe(0);
    expect(pricing.totalProfitPctKnown).toBe(0);
  });

  it('counts missing quotes for open positions', () => {
    const pricing = calculatePricing({
      positions: [openPosition],
      quotesMap: {},
      tab: 'open',
    });

    expect(pricing.missingQuotes).toBe(1);
  });

  it('returns the correct view copy', () => {
    expect(getPositionsCopy('open').headerSubtitle).toContain('Live portfolio view');
    expect(getPositionsCopy('closed').headerSubtitle).toContain('Closed trades');
  });
});