import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { themeRadius } from './style.helpers';

export function AppTooltip(props: TooltipProps) {
  return React.createElement(Tooltip, {
    arrow: true,
    placement: 'top',
    enterTouchDelay: 0,
    leaveTouchDelay: 2500,
    ...props,
  });
}

export const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: 'lg',
  paddingLeft: 0,
  paddingRight: 0,
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
  },
}));

export const PageCard = styled(Card)(({ theme }) => ({
  width: '100%',
  borderRadius: themeRadius(theme, 1, 14),
}));

export const SectionHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(1.75, 2),
  '& .MuiCardHeader-title': {
    fontWeight: 850,
    letterSpacing: '-0.02em',
    fontSize: theme.typography.pxToRem(18),
    lineHeight: 1.2,
  },
  '& .MuiCardHeader-subheader': {
    marginTop: theme.spacing(0.35),
    fontSize: theme.typography.pxToRem(13),
    lineHeight: 1.4,
    color: theme.palette.text.secondary,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 1.5),
    '& .MuiCardHeader-title': {
      fontSize: theme.typography.pxToRem(17),
    },
    '& .MuiCardHeader-subheader': {
      fontSize: theme.typography.pxToRem(12.5),
    },
  },
}));

export const SectionContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
}));

export const SectionDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.divider,
}));

export const CenteredBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const CenteredStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: theme.spacing(0.75),
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
}));

export const ToastSnackbar = styled(Snackbar)(({ theme }) => ({
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    borderRadius: 20,
    boxShadow: '0px 18px 50px rgba(15, 23, 42, 0.20)',
  },
}));

export const ToastAlert = styled(Alert)(() => ({
  alignItems: 'center',
  fontWeight: 800,
  letterSpacing: '0.01em',
}));

export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 850,
  letterSpacing: '-0.02em',
  marginTop: theme.spacing(0.75),
}));

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  maxWidth: 520,
}));

export const FullPageCentered = styled(Box)(({ theme }) => ({
  minHeight: '60vh',
  display: 'grid',
  placeItems: 'center',
  padding: theme.spacing(2.5),
}));

export const InlineInfoAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  borderRadius: themeRadius(theme, 0.9, 14),
  paddingTop: theme.spacing(0.8),
  paddingBottom: theme.spacing(0.8),
  '& .MuiAlert-message': {
    fontSize: theme.typography.pxToRem(13),
    lineHeight: 1.45,
  },
}));

export const InlineErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  '& .MuiAlert-message': {
    fontSize: theme.typography.pxToRem(13),
    lineHeight: 1.45,
  },
}));

export const TableWrap = styled(TableContainer)(({ theme }) => ({
  borderRadius: themeRadius(theme, 0.9, 14),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

export const Grid3 = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const Grid4 = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

export const SpacedSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(1.5),
}));

export const ControlsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const ControlsGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.4),
  alignItems: 'center',
}));

export const ControlsLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.secondary,
  letterSpacing: '0.02em',
  fontSize: theme.typography.pxToRem(11.5),
}));

export const MetricHeaderRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(0.75),
}));

export const SpacedAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  marginTop: theme.spacing(1.25),
}));

export const FormActions = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.75),
  display: 'flex',
  justifyContent: 'flex-start',
}));