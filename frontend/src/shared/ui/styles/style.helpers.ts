import { alpha, type Theme } from '@mui/material/styles';

export type Tone = 'positive' | 'negative' | 'neutral';

export function toneToColor(theme: Theme, tone: Tone) {
  if (tone === 'positive') return theme.palette.success.main;
  if (tone === 'negative') return theme.palette.error.main;
  return theme.palette.text.primary;
}

export function themeRadius(theme: Theme, multiplier: number, fallback = 16) {
  const raw = theme.shape.borderRadius;
  const base = typeof raw === 'number' ? raw : Number.parseFloat(String(raw));

  return Number.isFinite(base) && base > 0 ? base * multiplier : fallback;
}

export function buildStatusPillStyles(theme: Theme) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(0.9),
    paddingBottom: theme.spacing(0.9),
    borderRadius: 999,
    border: `1px solid ${theme.palette.divider}`,
    background:
      'linear-gradient(180deg, rgba(15,23,42,0.03) 0%, rgba(15,23,42,0.01) 100%)',
    boxShadow: '0px 10px 26px rgba(15, 23, 42, 0.06)',
    justifyContent: 'center',
  } as const;
}

export function buildSuccessDotStyles(theme: Theme) {
  return {
    width: 8,
    height: 8,
    borderRadius: 999,
    display: 'inline-block',
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.12)}`,
  } as const;
}