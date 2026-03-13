import {
  computeUpdatedLabel,
  formatDateTime,
  initialsFromName,
  isValidEmail,
} from './profilePage.helpers';

describe('profilePage.helpers', () => {
  it('formats valid ISO dates', () => {
    expect(formatDateTime('2026-01-01T00:00:00.000Z')).not.toBe('2026-01-01T00:00:00.000Z');
  });

  it('falls back to raw value for invalid dates', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date');
  });

  it('builds initials correctly', () => {
    expect(initialsFromName('John', 'Doe')).toBe('JD');
    expect(initialsFromName('John', '')).toBe('J');
    expect(initialsFromName('', '')).toBe('U');
  });

  it('formats updated labels', () => {
    const now = Date.now();
    expect(computeUpdatedLabel(now - 15_000)).toBe('15s ago');
    expect(computeUpdatedLabel(now - 2 * 60_000)).toBe('2m ago');
  });

  it('returns dash when updated timestamp is missing', () => {
    expect(computeUpdatedLabel(undefined)).toBe('—');
  });

  it('validates emails', () => {
    expect(isValidEmail('john@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});