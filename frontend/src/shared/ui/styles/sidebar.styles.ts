import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha, styled } from '@mui/material/styles';

import { SIDEBAR_WIDTH } from '../layout/styled.utils';

export const SidebarContainer = styled(Drawer)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: SIDEBAR_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export const SidebarInner = styled('div')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5),
}));

export const SidebarBrand = styled(Box)(({ theme }) => ({
  minHeight: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(0.25),
  paddingRight: theme.spacing(0.25),
  borderRadius: theme.shape.borderRadius,
  background: 'transparent',
  border: 'none',
  color: theme.palette.text.primary,
}));

export const SidebarPush = styled(Box)(() => ({
  flexGrow: 1,
}));

export const SidebarIcon = styled(ListItemIcon)(() => ({
  minWidth: 36,
  color: 'inherit',
}));

export const SidebarNavItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  borderRadius: 12,
  marginTop: theme.spacing(0.35),
  marginBottom: theme.spacing(0.35),
  paddingTop: theme.spacing(0.95),
  paddingBottom: theme.spacing(0.95),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 700,
    },
  }),
  '& .MuiListItemText-primary': {
    fontSize: theme.typography.pxToRem(13.5),
    fontWeight: 700,
  },
  '& .MuiListItemText-secondary': {
    fontSize: theme.typography.pxToRem(11.5),
    lineHeight: 1.35,
  },
  '&:hover': {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.text.primary, 0.035),
  },
}));

export const SidebarDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));