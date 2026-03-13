import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  searchInstruments,
  type InstrumentSearchResult,
} from '../api/marketDataClient';

type Options = {
  enabled?: boolean;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}

export function useInstrumentSearch(query: string, options?: Options) {
  const trimmed = query.trim().toLowerCase();
  const debouncedQuery = useDebouncedValue(trimmed, 300);

  return useQuery<InstrumentSearchResult[], Error>({
    queryKey: ['instrument-search', debouncedQuery],
    queryFn: () => searchInstruments(debouncedQuery),
    enabled: Boolean(options?.enabled) && debouncedQuery.length >= 2,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}