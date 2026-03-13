import { isFiniteNumber, money, normalizeSymbol, tableCellMoney, toneFromNumber } from './format';

describe('portfolio/utils/format', () => {
  it('toneFromNumber maps numeric sign to tone', () => {
    expect(toneFromNumber(10)).toBe('positive');
    expect(toneFromNumber(-10)).toBe('negative');
    expect(toneFromNumber(0)).toBe('neutral');
  });

  it('isFiniteNumber validates numeric finiteness', () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber('1')).toBe(false);
  });

  it('normalizeSymbol trims and uppercases', () => {
    expect(normalizeSymbol(' aapl ')).toBe('AAPL');
  });

  it('money formats as USD currency', () => {
    expect(money(1234.56)).toContain('$');
  });

  it('tableCellMoney returns em dash for nullish or invalid values', () => {
    expect(tableCellMoney(null)).toBe('—');
    expect(tableCellMoney(undefined)).toBe('—');
  });

  it('tableCellMoney formats valid values', () => {
    expect(tableCellMoney(12.5)).toContain('$');
  });
});