import { useMemo } from 'react';

import type { RemoteQuote } from '@features/market-data';
import type { Position } from '../types/position';
import { isFiniteNumber, normalizeSymbol, toneFromNumber } from '../utils/format';
import type { PricingTotals, Tab } from './usePositionsPage.types';

type CalculatePricingArgs = {
  positions: Position[];
  quotesMap: Record<string, RemoteQuote>;
  tab: Tab;
};

export function calculatePricing({
  positions,
  quotesMap,
  tab,
}: CalculatePricingArgs): PricingTotals {
  let invested = 0;
  let profitKnown = 0;
  let missingQuotes = 0;

  for (const position of positions) {
    const cost = position.buyPrice * position.quantity;
    invested += cost;

    if (tab === 'closed') {
      const sellPrice = isFiniteNumber(position.sellPrice) ? position.sellPrice : position.buyPrice;
      profitKnown += sellPrice * position.quantity - cost;
      continue;
    }

    const quote = quotesMap[normalizeSymbol(position.ticker)];
    if (!quote || !isFiniteNumber(quote.currentPrice)) {
      missingQuotes += 1;
      continue;
    }

    profitKnown += quote.currentPrice * position.quantity - cost;
  }

  const profitPctKnown = invested ? (profitKnown / invested) * 100 : 0;

  return {
    totalInvested: invested,
    totalProfitKnown: profitKnown,
    totalProfitPctKnown: profitPctKnown,
    missingQuotes,
  };
}

export function getPositionsCopy(tab: Tab): {
  headerSubtitle: string;
  listSubtitle: string;
} {
  return tab === 'open'
    ? {
        headerSubtitle: 'Live portfolio view with real-time quote updates.',
        listSubtitle: 'Live pricing, invested capital, and unrealized performance.',
      }
    : {
        headerSubtitle: 'Closed trades with realized profit/loss.',
        listSubtitle: 'Sell prices, realized profit/loss, and trade outcomes.',
      };
}

export function usePositionsPricing(args: CalculatePricingArgs) {
  const pricing = useMemo(() => calculatePricing(args), [args]);
  const copy = useMemo(() => getPositionsCopy(args.tab), [args.tab]);

  const totalsProfitTone = toneFromNumber(pricing.totalProfitKnown);
  const totalsPctTone = toneFromNumber(pricing.totalProfitPctKnown);

  return {
    pricing,
    totalsProfitTone,
    totalsPctTone,
    headerSubtitle: copy.headerSubtitle,
    listSubtitle: copy.listSubtitle,
  };
}