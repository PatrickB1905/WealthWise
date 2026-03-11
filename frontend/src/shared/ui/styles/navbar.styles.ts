import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

export const NavbarAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const NavbarToolbar = styled(Toolbar)(({ theme }) => ({
  gap: theme.spacing(0.75),
  minHeight: 58,
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    minHeight: 54,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export const NavbarTitle = styled('div')(() => ({
  flexGrow: 1,
}));

export const NavbarTitleWrap = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.15),
  minWidth: 0,
}));

export const NavbarTitleRow = styled(Stack)(() => ({
  minWidth: 0,
}));

export const UserMenuButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingLeft: theme.spacing(0.75),
  paddingRight: theme.spacing(0.9),
  paddingTop: theme.spacing(0.45),
  paddingBottom: theme.spacing(0.45),
  minHeight: 40,
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  backgroundColor: alpha(theme.palette.text.primary, 0.02),
  textTransform: 'none',
  gap: theme.spacing(0.75),
  transition: 'background-color 140ms ease, border-color 140ms ease, transform 140ms ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.text.primary, 0.04),
    borderColor: alpha(theme.palette.text.primary, 0.14),
    transform: 'translateY(-1px)',
  },
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  fontSize: theme.typography.pxToRem(12),
  fontWeight: 850,
  letterSpacing: '-0.03em',
  color: theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
  boxShadow: `0 8px 14px ${alpha(theme.palette.primary.main, 0.14)}`,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(
    theme.palette.primary.main,
    0.55,
  )} 100%)`,
}));

export const UserEmailText = styled(Typography)(({ theme }) => ({
  fontWeight: 750,
  fontSize: theme.typography.pxToRem(12.5),
  letterSpacing: '-0.01em',
  color: theme.palette.text.primary,
  maxWidth: 220,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 140,
  },
}));