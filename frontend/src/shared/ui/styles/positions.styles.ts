import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

import { toneToColor, themeRadius, type Tone } from './style.helpers';

export const KpiGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.25),
  marginBottom: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

export const KpiCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: themeRadius(theme, 1, 14),
}));

export const KpiCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1.75),
  '&:last-child': { paddingBottom: theme.spacing(1.75) },
}));

export const KpiTopRow = styled(Stack)(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

export const KpiLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontSize: theme.typography.pxToRem(11.5),
}));

export const KpiValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Tone }>(({ theme, tone }) => ({
  fontWeight: 850,
  letterSpacing: '-0.02em',
  color: toneToColor(theme, tone),
  fontVariantNumeric: 'tabular-nums',
  fontSize: theme.typography.pxToRem(28),
  lineHeight: 1.15,
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.pxToRem(24),
  },
}));

export const KpiSub = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.4),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(12.5),
  lineHeight: 1.45,
}));

export const KpiChip = styled(Chip)(({ theme }) => ({
  fontWeight: 800,
  borderRadius: 999,
  height: 24,
  backgroundColor: alpha(theme.palette.text.primary, 0.04),
}));

export const KpiInfoButton = styled(IconButton)(({ theme }) => ({
  width: 16,
  height: 16,
  padding: 0,
  marginLeft: theme.spacing(0.2),
  borderRadius: 999,
  color: alpha(theme.palette.text.secondary, 0.7),
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: 14,
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
  },
  '&.Mui-focusVisible': {
    outline: 'none',
    backgroundColor: 'transparent',
  },
}));

export const PositionsTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: themeRadius(theme, 0.9, 14),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    overflowX: 'auto',
  },
  '& .MuiTableCell-root': {
    paddingTop: theme.spacing(1.1),
    paddingBottom: theme.spacing(1.1),
  },
  '& .MuiTableCell-head': {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: 800,
    color: theme.palette.text.secondary,
  },
  '& .MuiTableCell-body': {
    fontSize: theme.typography.pxToRem(13),
  },
}));

export const StickyTableHead = styled(TableHead)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
}));

export const EmptyStateWrap = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing(0.75),
}));

export const SkeletonBlock = styled(Skeleton)(({ theme }) => ({
  borderRadius: themeRadius(theme, 0.8, 12),
}));

export const PositionsTabGroupWrap = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'flex-start',
  gap: theme.spacing(0.75),
  flexWrap: 'wrap',
}));

export const PositionsActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(0.75),
  flexWrap: 'wrap',
}));

export const MutedHelperText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.pxToRem(12.5),
}));

export const TickerCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.875),
}));

export const TickerLogo = styled(Box)(() => ({
  width: 22,
  height: 22,
  '& .MuiAvatar-root': {
    width: 22,
    height: 22,
    fontSize: 11,
  },
}));

export const ProfitCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Tone }>(({ theme, tone }) => ({
  color: toneToColor(theme, tone),
  fontVariantNumeric: 'tabular-nums',
}));

export const TotalsRow = styled(TableRow)(({ theme }) => ({
  borderTop: `2px solid ${theme.palette.divider}`,
}));

export const MobileListWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const MobilePositionCard = styled(Card)(({ theme }) => ({
  borderRadius: themeRadius(theme, 1, 14),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  boxShadow: '0px 8px 22px rgba(15, 23, 42, 0.08)',
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.99)} 0%, ${alpha(
    theme.palette.background.paper,
    0.96,
  )} 100%)`,
  padding: theme.spacing(1.5),
}));

export const MobileCardTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const MobileCardTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

export const MobileCardMetaRow = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const MobileFieldGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
}));

export const MobileField = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  minWidth: 0,
}));

export const MobileFieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

export const MobileFieldValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone?: Tone }>(({ theme, tone }) => ({
  fontWeight: 800,
  letterSpacing: '-0.01em',
  fontVariantNumeric: 'tabular-nums',
  fontSize: theme.typography.pxToRem(13.5),
  color: tone ? toneToColor(theme, tone) : theme.palette.text.primary,
}));

export const MobileCardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.75),
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
}));

export const InlineIconWrap = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const MobileTickerAvatar = styled(Avatar)(() => ({
  width: 26,
  height: 26,
  fontSize: 12,
}));

export const MobileTickerSymbol = styled(Typography)(({ theme }) => ({
  fontWeight: 850,
  fontSize: theme.typography.pxToRem(15),
  letterSpacing: '-0.02em',
}));

export const MobileTickerPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 850,
  fontSize: theme.typography.pxToRem(14),
}));

export const SoftDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1.25),
  marginBottom: theme.spacing(1.25),
}));

export const TotalsCard = styled(MobilePositionCard)(({ theme }) => ({
  marginTop: theme.spacing(1.25),
}));