import { ageLabel, formatDate } from './news';

describe('news types helpers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-11T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formatDate returns the original string for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('formatDate formats valid dates', () => {
    const result = formatDate('2026-03-10T12:00:00.000Z');
    expect(typeof result).toBe('string');
    expect(result).not.toBe('2026-03-10T12:00:00.000Z');
  });

  it('ageLabel returns null for invalid dates', () => {
    expect(ageLabel('not-a-date')).toBeNull();
  });

  it('ageLabel formats seconds, minutes, hours, and days', () => {
    expect(ageLabel('2026-03-11T11:59:45.000Z')).toBe('15s');
    expect(ageLabel('2026-03-11T11:55:00.000Z')).toBe('5m');
    expect(ageLabel('2026-03-11T10:00:00.000Z')).toBe('2h');
    expect(ageLabel('2026-03-08T12:00:00.000Z')).toBe('3d');
  });
});