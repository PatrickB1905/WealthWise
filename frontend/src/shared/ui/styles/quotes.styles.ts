import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { alpha, styled } from '@mui/material/styles';

export const QuoteMetaWrap = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}));

export const QuoteFreshDot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'state',
})<{ state: 'fresh' | 'stale' | 'missing' }>(({ theme, state }) => {
  const base = {
    width: 8,
    height: 8,
    borderRadius: 999,
    display: 'inline-block',
    boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.85)}`,
  } as const;

  if (state === 'fresh') return { ...base, backgroundColor: theme.palette.success.main };
  if (state === 'stale') return { ...base, backgroundColor: theme.palette.warning.main };
  return { ...base, backgroundColor: theme.palette.action.disabled };
});

export const QuoteTooltip = styled(Tooltip)(() => ({}));