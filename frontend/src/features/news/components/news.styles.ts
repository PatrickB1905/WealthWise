import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton, { type ListItemButtonProps } from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { SectionContent } from '@shared/ui';
import {
  buildStatusPillStyles,
  buildSuccessDotStyles,
} from '@shared/ui/styles/style.helpers';

export const NewsListItem = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.4),
}));

export const NewsHeaderWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
  },
}));

export const NewsBrandIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  background: 'linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.015) 100%)',
  boxShadow: '0px 8px 20px rgba(15, 23, 42, 0.05)',
  flex: '0 0 auto',
}));

export const NewsBrandText = styled(Box)(() => ({
  minWidth: 0,
}));

export const NewsTitleText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(17),
  fontWeight: 850,
  lineHeight: 1.2,
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.pxToRem(18),
  },
}));

export const NewsSubtitleText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12.5),
}));

export const NewsHeaderActions = styled(Stack)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto',
  },
}));

export const NewsTickerChipsWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}));

export const NewsTickerChip = styled(Chip)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '0.02em',
  borderRadius: 999,
  height: 24,
  fontSize: theme.typography.pxToRem(11.5),
}));

export const NewsMoreChip = styled(Chip)(({ theme }) => ({
  fontWeight: 800,
  borderRadius: 999,
  height: 24,
  fontSize: theme.typography.pxToRem(11.5),
}));

export const NewsUpdatedRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(0.75),
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-end',
  },
}));

export const NewsUpdatedPill = styled(Box)<{ dimmed?: boolean }>(({ theme, dimmed }) => ({
  ...buildStatusPillStyles(theme),
  minWidth: 150,
  width: '100%',
  opacity: dimmed ? 0.9 : 1,
  paddingLeft: theme.spacing(1.4),
  paddingRight: theme.spacing(1.4),
  paddingTop: theme.spacing(0.65),
  paddingBottom: theme.spacing(0.65),
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const NewsUpdatedDot = styled('span')(({ theme }) => ({
  ...buildSuccessDotStyles(theme),
}));

export const NewsUpdatedText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12.5),
  fontWeight: 800,
  color: theme.palette.text.secondary,
}));

export const NewsRefreshDesktopButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 800,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.8),
  paddingBottom: theme.spacing(0.8),
  minHeight: 34,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
  },
}));

export const NewsSubheaderWrap = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.75),
}));

export const NewsContent = styled(SectionContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(1.25),
  },
}));

export const NewsArticlesList = styled(List)(({ theme }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

export const NewsArticleItem = styled(NewsListItem)<{ dimmed?: boolean }>(({ theme, dimmed }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  borderRadius: 0,
  transition: 'background-color 140ms ease, transform 140ms ease',
  opacity: dimmed ? 0.85 : 1,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:active': {
    transform: 'scale(0.995)',
    [theme.breakpoints.up('md')]: {
      transform: 'none',
    },
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(1.75),
    paddingRight: theme.spacing(1.75),
  },
}));

export const NewsArticleTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 850,
  lineHeight: 1.3,
  fontSize: theme.typography.pxToRem(15),
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  paddingRight: theme.spacing(0.75),
  WebkitLineClamp: 3,
  [theme.breakpoints.up('md')]: {
    WebkitLineClamp: 2,
  },
}));

export const NewsArticleRightMeta = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flex: '0 0 auto',
}));

export const NewsAgeChip = styled(Chip)(({ theme }) => ({
  height: 22,
  borderRadius: 999,
  fontWeight: 800,
  fontSize: theme.typography.pxToRem(11),
}));

export const NewsOpenIconBoxMobile = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: 8,
  display: 'grid',
  placeItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const NewsDotSeparator = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

export const NewsMetaSpacer = styled(Box)(() => ({
  flex: 1,
}));

export const NewsOpenLinkDesktop = styled(Link)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: 800,
  fontSize: theme.typography.pxToRem(12),
  [theme.breakpoints.up('md')]: {
    display: 'inline-flex',
  },
}));

export const NewsMobileStickyAction = styled(Box)(({ theme }) => ({
  position: 'sticky',
  bottom: 12,
  marginTop: theme.spacing(1.5),
  display: 'block',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

export const NewsMobileRefreshButton = styled(Button)(({ theme }) => ({
  borderRadius: 14,
  paddingTop: theme.spacing(1.1),
  paddingBottom: theme.spacing(1.1),
  fontWeight: 850,
  boxShadow: '0px 14px 30px rgba(15, 23, 42, 0.16)',
}));