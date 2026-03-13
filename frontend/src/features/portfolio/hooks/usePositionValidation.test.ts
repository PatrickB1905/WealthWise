import dayjs from 'dayjs';

import {
  BUY_DATE_INVALID_MESSAGE,
  BUY_DATE_REQUIRED_MESSAGE,
  BUY_PRICE_POSITIVE_MESSAGE,
  BUY_PRICE_REQUIRED_MESSAGE,
  QUANTITY_ERROR_MESSAGE,
  SELL_DATE_INVALID_MESSAGE,
  SELL_DATE_REQUIRED_MESSAGE,
  SELL_PRICE_REQUIRED_MESSAGE,
  TICKER_REQUIRED_MESSAGE,
  extractApiErrorDetail,
  parsePositiveNumber,
  parseRequiredNumberAllowZero,
  validateBuyDate,
  validateBuyPrice,
  validateQuantity,
  validateSellDate,
  validateSellPrice,
  validateTicker,
} from './usePositionValidation';

describe('usePositionValidation helpers', () => {
  it('parses positive numbers', () => {
    expect(parsePositiveNumber('10')).toBe(10);
    expect(parsePositiveNumber('0')).toBeNull();
    expect(parsePositiveNumber('-5')).toBeNull();
    expect(parsePositiveNumber('abc')).toBeNull();
  });

  it('parses required numbers allowing zero', () => {
    expect(parseRequiredNumberAllowZero('0')).toBe(0);
    expect(parseRequiredNumberAllowZero('15')).toBe(15);
    expect(parseRequiredNumberAllowZero('abc')).toBeNull();
    expect(parseRequiredNumberAllowZero('')).toBeNull();
  });

  it('extracts api detail', () => {
    expect(
      extractApiErrorDetail({
        response: {
          data: {
            detail: 'Ticker already exists',
          },
        },
      }),
    ).toBe('Ticker already exists');

    expect(extractApiErrorDetail(new Error('boom'))).toBeUndefined();
  });

  it('validates ticker', () => {
    expect(validateTicker(null)).toEqual({
      value: null,
      error: TICKER_REQUIRED_MESSAGE,
    });

    expect(
      validateTicker({
        symbol: 'MSFT',
        name: 'Microsoft',
        exchange: 'NASDAQ',
        assetType: 'stock',
        currency: 'USD',
        logoUrl: '',
      }),
    ).toEqual({
      value: 'MSFT',
      error: '',
    });
  });

  it('validates quantity', () => {
    expect(validateQuantity('0')).toEqual({
      value: null,
      error: QUANTITY_ERROR_MESSAGE,
    });

    expect(validateQuantity('5')).toEqual({
      value: 5,
      error: '',
    });
  });

  it('validates buy price', () => {
    expect(validateBuyPrice('')).toEqual({
      value: null,
      error: BUY_PRICE_REQUIRED_MESSAGE,
    });

    expect(validateBuyPrice('0')).toEqual({
      value: null,
      error: BUY_PRICE_POSITIVE_MESSAGE,
    });

    expect(validateBuyPrice('100')).toEqual({
      value: 100,
      error: '',
    });
  });

  it('validates buy date', () => {
    expect(validateBuyDate(null)).toEqual({
      value: null,
      error: BUY_DATE_REQUIRED_MESSAGE,
    });

    expect(validateBuyDate(dayjs('invalid'))).toEqual({
      value: null,
      error: BUY_DATE_INVALID_MESSAGE,
    });

    expect(validateBuyDate(dayjs('2026-03-10')).error).toBe('');
  });

  it('validates sell price', () => {
    expect(validateSellPrice('')).toEqual({
      value: null,
      error: SELL_PRICE_REQUIRED_MESSAGE,
    });

    expect(validateSellPrice('0')).toEqual({
      value: 0,
      error: '',
    });
  });

  it('validates sell date', () => {
    expect(validateSellDate(null)).toEqual({
      value: null,
      error: SELL_DATE_REQUIRED_MESSAGE,
    });

    expect(validateSellDate(dayjs('invalid'))).toEqual({
      value: null,
      error: SELL_DATE_INVALID_MESSAGE,
    });

    expect(validateSellDate(dayjs('2026-03-10')).error).toBe('');
  });
});