import { initialsFromEmail, initialsFromName } from '../navbar.utils';

describe('navbar.utils', () => {
  describe('initialsFromName', () => {
    it('returns initials for first and last name', () => {
      expect(initialsFromName('John', 'Doe')).toBe('JD');
    });

    it('handles whitespace and casing', () => {
      expect(initialsFromName(' john ', ' doe ')).toBe('JD');
    });

    it('returns a single initial when only first name exists', () => {
      expect(initialsFromName('John', null)).toBe('J');
    });

    it('returns a single initial when only last name exists', () => {
      expect(initialsFromName(null, 'Doe')).toBe('D');
    });

    it('returns null when both names are empty', () => {
      expect(initialsFromName('', '   ')).toBeNull();
    });
  });

  describe('initialsFromEmail', () => {
    it('uses segmented local-part initials when available', () => {
      expect(initialsFromEmail('john.doe@example.com')).toBe('JD');
      expect(initialsFromEmail('john_doe@example.com')).toBe('JD');
      expect(initialsFromEmail('john-doe@example.com')).toBe('JD');
    });

    it('falls back to first two local-part characters', () => {
      expect(initialsFromEmail('pa@example.com')).toBe('PA');
    });

    it('returns one character for one-letter local-part', () => {
      expect(initialsFromEmail('p@example.com')).toBe('P');
    });

    it('returns U when the local-part is empty', () => {
      expect(initialsFromEmail('@example.com')).toBe('U');
    });
  });
});