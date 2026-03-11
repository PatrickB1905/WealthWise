import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha, styled } from '@mui/material/styles';

import heroImgUrl from '@assets/images/marketing/hero/hero.png';
import { themeRadius } from '@shared/ui/styles/style.helpers';

export const HeroSection = styled('section')(({ theme }) => ({
  minHeight: '100vh',
  position: 'relative',
  backgroundImage: `url(${heroImgUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.25),
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '100dvh',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export const HeroOverlay = styled(Box)(() => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    radial-gradient(1100px 520px at 22% 42%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.10) 35%, rgba(2,6,23,0.00) 62%),
    linear-gradient(90deg, rgba(2,6,23,0.86) 0%, rgba(2,6,23,0.58) 46%, rgba(2,6,23,0.40) 100%)
  `,
  boxShadow: `inset 0 -120px 160px ${alpha('#020617', 0.35)}`,
}));

export const AuthContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 500,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

export const AuthPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: themeRadius(theme, 1.35, 16),
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  boxShadow: theme.shadows[10],
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
    borderRadius: themeRadius(theme, 1.1, 14),
  },
}));

export const FormHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

export const FormButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1.25),
  minHeight: 40,
  paddingTop: theme.spacing(0.9),
  paddingBottom: theme.spacing(0.9),
  fontWeight: 800,
  textTransform: 'none',
  borderRadius: theme.spacing(1.5),
}));

export const FormFooter = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: 'center',
}));

export const MarketingTopNav = styled('div')(() => ({
  position: 'absolute',
  insetInline: 0,
  top: 0,
  zIndex: 2,
}));

export const MarketingTopNavInner = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(0.875),
    paddingBottom: theme.spacing(0.875),
  },
}));

export const MarketingNavLink = styled('button')(({ theme }) => ({
  appearance: 'none',
  border: 0,
  background: 'transparent',
  color: alpha(theme.palette.common.white, 0.86),
  fontWeight: 800,
  letterSpacing: '-0.01em',
  cursor: 'pointer',
  padding: theme.spacing(0.45, 0.75),
  borderRadius: 999,
  transition: 'background-color 140ms ease, color 140ms ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    color: theme.palette.common.white,
  },
}));

export const MarketingNavActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}));

export const CTAOutlineButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  borderColor: alpha(theme.palette.common.white, 0.75),
  fontWeight: 800,
  textTransform: 'none',
  minHeight: 34,
  paddingLeft: theme.spacing(1.1),
  paddingRight: theme.spacing(1.1),
  borderRadius: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: theme.palette.common.white,
  },
}));

export const LoginBackButton = styled(CTAOutlineButton)(() => ({
  borderColor: 'rgba(255,255,255,0.55)',
}));

export const RegisterBackButton = styled(CTAOutlineButton)(() => ({
  borderColor: 'rgba(255,255,255,0.55)',
}));

export const MarketingMenuButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 999,
  border: `1px solid ${alpha(theme.palette.common.white, 0.14)}`,
  backgroundColor: alpha(theme.palette.common.white, 0.06),
  backdropFilter: 'blur(14px)',
  color: theme.palette.common.white,
  padding: theme.spacing(0.7),
  transition: 'background-color 140ms ease, transform 140ms ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: 'translateY(-1px)',
  },
}));