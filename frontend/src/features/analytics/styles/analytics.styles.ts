import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { ControlsLabel, MetricHeaderRow, PageCard } from '@shared/ui';
import {
  buildStatusPillStyles,
  buildSuccessDotStyles,
  toneToColor,
  type Tone,
} from '@shared/ui/styles/style.helpers';

export const MetricCard = styled(PageCard)(() => ({
  height: '100%',
}));

export const MetricValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: Tone }>(({ theme, tone }) => ({
  fontWeight: 850,
  color: toneToColor(theme, tone),
  fontVariantNumeric: 'tabular-nums',
  fontSize: theme.typography.pxToRem(28),
  lineHeight: 1.15,
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.typography.pxToRem(24),
  },
}));

export const AnalyticsRangeToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    fontWeight: 700,
    minHeight: 34,
    fontSize: theme.typography.pxToRem(12.5),
  },
}));

export const AnalyticsChartBox = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 300,
  [theme.breakpoints.down('sm')]: {
    height: 240,
  },
}));

export const AnalyticsControlsCard = styled(PageCard)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const AnalyticsControlsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr auto',
    gap: theme.spacing(2.5),
  },
}));

export const AnalyticsControlBlock = styled(Box)(() => ({
  minWidth: 0,
}));

export const AnalyticsControlLabel = styled(ControlsLabel)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.75),
  display: 'block',
}));

export const AnalyticsLabelInline = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
}));

export const AnalyticsToggleGroup = styled(AnalyticsRangeToggleGroup)(({ theme }) => ({
  width: '100%',
  '& .MuiToggleButton-root': {
    flex: 1,
    borderRadius: 8,
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
  },
}));

export const AnalyticsHeaderToggleGroup = styled(AnalyticsRangeToggleGroup)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  '& .MuiToggleButton-root': {
    flex: 1,
    borderRadius: theme.spacing(0.75),
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    minHeight: 34,
    [theme.breakpoints.up('sm')]: {
      flex: 'initial',
    },
  },
}));

export const AnalyticsFreshnessWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 170,
  },
}));

export const AnalyticsFreshnessPill = styled(Box)(({ theme }) => ({
  ...buildStatusPillStyles(theme),
  minWidth: 132,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.7),
  paddingBottom: theme.spacing(0.7),
}));

export const AnalyticsFreshnessDot = styled('span')(({ theme }) => ({
  ...buildSuccessDotStyles(theme),
}));

export const AnalyticsChartFrame = styled(AnalyticsChartBox)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

export const AnalyticsHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
}));

export const AnalyticsHeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(0.9),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
  },
}));

export const AnalyticsTableHeadLabel = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  fontWeight: 800,
}));

export const AnalyticsTableHeadLabelRight = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  justifyContent: 'flex-end',
  fontWeight: 800,
}));

export const AnalyticsFreshnessText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12.5),
  fontWeight: 800,
  color: theme.palette.text.secondary,
}));

export { MetricHeaderRow };