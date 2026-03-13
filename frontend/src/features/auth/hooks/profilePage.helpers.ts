export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function initialsFromName(firstName?: string, lastName?: string): string {
  const a = (firstName ?? '').trim();
  const b = (lastName ?? '').trim();
  const i1 = a ? a[0].toUpperCase() : '';
  const i2 = b ? b[0].toUpperCase() : '';
  const out = `${i1}${i2}`.trim();
  return out || 'U';
}

export function computeUpdatedLabel(updatedAtMs?: number): string {
  const ms = updatedAtMs;
  if (!ms) return '—';

  const secondsAgo = Math.max(0, (Date.now() - ms) / 1000);
  if (secondsAgo < 60) return `${Math.round(secondsAgo)}s ago`;

  const minutesAgo = Math.round(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;

  const hoursAgo = Math.round(minutesAgo / 60);
  return `${hoursAgo}h ago`;
}

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (!email) return false;
  return email.includes('@') && email.includes('.');
}