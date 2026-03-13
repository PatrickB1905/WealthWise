import type { Dayjs } from 'dayjs';

import type { InstrumentSearchResult } from '@features/market-data';
import { normalizeSymbol } from '../utils/format';

export const QUANTITY_ERROR_MESSAGE = 'Quantity must be greater than 0';
export const BUY_PRICE_REQUIRED_MESSAGE = 'Buy price is required';
export const BUY_PRICE_POSITIVE_MESSAGE = 'Buy price must be greater than 0';
export const BUY_DATE_REQUIRED_MESSAGE = 'Buy date is required';
export const BUY_DATE_INVALID_MESSAGE = 'Enter a valid buy date';
export const SELL_PRICE_REQUIRED_MESSAGE = 'Sell price is required';
export const SELL_DATE_REQUIRED_MESSAGE = 'Sell date is required';
export const SELL_DATE_INVALID_MESSAGE = 'Enter a valid sell date';
export const TICKER_REQUIRED_MESSAGE = 'Please select a valid ticker from the list';

export type ValidationResult<T> = {
  value: T | null;
  error: string;
};

export function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function parseRequiredNumberAllowZero(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export function extractApiErrorDetail(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }

  const response = (error as { response?: { data?: unknown } }).response;
  const data = response?.data;

  if (typeof data === 'object' && data !== null && 'detail' in data) {
    const detail = (data as { detail?: unknown }).detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail.trim();
    }
  }

  return undefined;
}

export function validateTicker(
  selectedInstrument: InstrumentSearchResult | null,
): ValidationResult<string> {
  if (!selectedInstrument) {
    return { value: null, error: TICKER_REQUIRED_MESSAGE };
  }

  const normalizedSymbol = normalizeSymbol(selectedInstrument.symbol);
  if (!normalizedSymbol) {
    return { value: null, error: TICKER_REQUIRED_MESSAGE };
  }

  return { value: normalizedSymbol, error: '' };
}

export function validateQuantity(value: string): ValidationResult<number> {
  const parsedQuantity = parsePositiveNumber(value);
  if (parsedQuantity === null) {
    return { value: null, error: QUANTITY_ERROR_MESSAGE };
  }

  return { value: parsedQuantity, error: '' };
}

export function validateBuyPrice(value: string): ValidationResult<number> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { value: null, error: BUY_PRICE_REQUIRED_MESSAGE };
  }

  const parsedBuyPrice = parsePositiveNumber(trimmed);
  if (parsedBuyPrice === null) {
    return { value: null, error: BUY_PRICE_POSITIVE_MESSAGE };
  }

  return { value: parsedBuyPrice, error: '' };
}

export function validateBuyDate(value: Dayjs | null): ValidationResult<string> {
  if (value === null) {
    return { value: null, error: BUY_DATE_REQUIRED_MESSAGE };
  }

  if (!value.isValid()) {
    return { value: null, error: BUY_DATE_INVALID_MESSAGE };
  }

  return { value: value.toISOString(), error: '' };
}

export function validateSellPrice(value: string): ValidationResult<number> {
  const trimmed = value.trim();
  if (!trimmed) {
    return { value: null, error: SELL_PRICE_REQUIRED_MESSAGE };
  }

  const parsedSellPrice = parseRequiredNumberAllowZero(trimmed);
  if (parsedSellPrice === null) {
    return { value: null, error: SELL_PRICE_REQUIRED_MESSAGE };
  }

  return { value: parsedSellPrice, error: '' };
}

export function validateSellDate(value: Dayjs | null): ValidationResult<string> {
  if (value === null) {
    return { value: null, error: SELL_DATE_REQUIRED_MESSAGE };
  }

  if (!value.isValid()) {
    return { value: null, error: SELL_DATE_INVALID_MESSAGE };
  }

  return { value: value.toISOString(), error: '' };
}