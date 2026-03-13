import { useEffect, useState } from 'react';

import type { Tab } from './usePositionsPage.types';

type UsePositionsQuoteAlertArgs = {
  tab: Tab;
  quotesLoading: boolean;
  missingQuotes: number;
};

export function usePositionsQuoteAlert({
  tab,
  quotesLoading,
  missingQuotes,
}: UsePositionsQuoteAlertArgs) {
  const [showQuoteAlert, setShowQuoteAlert] = useState(false);

  useEffect(() => {
    if (tab !== 'open') {
      setShowQuoteAlert(false);
      return;
    }

    if (quotesLoading) {
      setShowQuoteAlert(false);
      return;
    }

    if (missingQuotes <= 0) {
      setShowQuoteAlert(false);
      return;
    }

    const timeoutId = window.setTimeout(() => setShowQuoteAlert(true), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [missingQuotes, quotesLoading, tab]);

  return showQuoteAlert;
}