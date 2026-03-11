import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { alpha, styled, type SxProps, type Theme } from '@mui/material/styles';

import heroImgUrl from '@assets/images/marketing/hero/hero.png';
import { themeRadius } from '@shared/ui/styles/style.helpers';

export const mobileMenuPaperSx: SxProps<Theme> = {
  mt: 1,
  minWidth: 220,
  borderRadius: 3,
  border: '1px solid rgba(255,255,255,0.14)',
  backgroundColor: 'rgba(15, 23, 42, 0.92)',
  backdropFilter: 'blur(14px)',
  color: 'rgba(255,255,255,0.92)',
};

export const BrandTagline = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.86),
  fontWeight: 650,
}));

export const HeroActions = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));

export const KickerDot = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: 999,
  display: 'inline-block',
  backgroundColor: alpha(theme.palette.primary.main, 0.95),
  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}`,
}));

export const SubtleKicker = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: alpha(theme.palette.common.white, 0.86),
  fontWeight: 850,
  letterSpacing: '-0.01em',
}));

export const HomeHero = styled('section')(({ theme }) => ({
  position: 'relative',
  minHeight: '92vh',
  overflow: 'hidden',
  backgroundImage: `url(${heroImgUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    minHeight: '82vh',
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

export const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  color: theme.palette.common.white,
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(9),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(7),
  },
}));

export const CTAButton = styled(Button)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  fontWeight: 800,
}));

export const PrimaryHeroButton = styled(CTAButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

export const CTAOutlineButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  borderColor: alpha(theme.palette.common.white, 0.75),
  fontWeight: 800,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: theme.palette.common.white,
  },
}));

export const MarketingMenuButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 999,
  border: `1px solid ${alpha(theme.palette.common.white, 0.14)}`,
  backgroundColor: alpha(theme.palette.common.white, 0.06),
  backdropFilter: 'blur(14px)',
  color: theme.palette.common.white,
  padding: theme.spacing(0.9),
  transition: 'background-color 140ms ease, transform 140ms ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    transform: 'translateY(-1px)',
  },
}));

export const SectionEyebrow = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

export const SectionSurface = styled('section')(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(9),
  paddingBottom: theme.spacing(9),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(7),
  },
}));

export const SoftGridBackground = styled('div')(() => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage: `
    radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, rgba(255,255,255,0) 0),
    radial-gradient(800px 520px at 12% 18%, rgba(37,99,235,0.10), rgba(255,255,255,0) 60%),
    radial-gradient(800px 520px at 88% 82%, rgba(2,6,23,0.06), rgba(255,255,255,0) 62%)
  `,
  backgroundSize: '24px 24px, auto, auto',
  opacity: 1,
}));

export const SectionWrap = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

export const SectionBodyText = styled(Typography)(({ theme }) => ({
  maxWidth: 820,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: theme.spacing(2),
}));

export const FeaturesSection = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
}));

export const FeatureCardLayout = styled(Card)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: themeRadius(theme, 2, 16),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  boxShadow: '0px 6px 18px rgba(15, 23, 42, 0.10)',
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.98)} 0%, ${alpha(
    theme.palette.background.paper,
    0.94,
  )} 100%)`,
  transition: 'transform 170ms ease, box-shadow 170ms ease, border-color 170ms ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 14px 40px rgba(15, 23, 42, 0.14)',
    borderColor: alpha(theme.palette.primary.main, 0.22),
  },
}));

export const IconBadge = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 18,
  display: 'grid',
  placeItems: 'center',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.05)})`,
  boxShadow: `0 16px 26px ${alpha(theme.palette.primary.main, 0.08)}`,
  marginBottom: theme.spacing(2),
}));

export const SplitGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1.1fr 0.9fr',
    alignItems: 'center',
  },
}));

export const PreviewCard = styled(Card)(({ theme }) => ({
  borderRadius: themeRadius(theme, 1.4, 18),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
  overflow: 'hidden',
  boxShadow: '0px 18px 52px rgba(15, 23, 42, 0.14)',
}));

export const PreviewCardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.25),
  backgroundColor: alpha(theme.palette.background.paper, 0.98),
}));

export const PreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  display: 'block',
  borderRadius: themeRadius(theme, 1.1, 16),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
}));

export const CalloutSection = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(2),
  overflow: 'hidden',
  background:
    'linear-gradient(135deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.65) 55%, rgba(2,6,23,0.45) 100%)',
}));

export const CalloutWrap = styled(Container)(({ theme }) => ({
  position: 'relative',
  color: theme.palette.common.white,
  paddingTop: theme.spacing(7),
  paddingBottom: theme.spacing(7),
  textAlign: 'center',
}));

export const CalloutTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 950,
  letterSpacing: '-0.02em',
}));

export const CalloutText = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.86),
  maxWidth: 760,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

export const CalloutActions = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

export const FooterSection = styled('footer')(({ theme }) => ({
  marginTop: theme.spacing(0),
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
  color: theme.palette.text.secondary,
  background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.86)} 0%, ${theme.palette.background.paper} 100%)`,
}));

export const FooterGrid = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
  },
}));

export const FooterTitle = styled(Typography)(() => ({
  fontWeight: 950,
  letterSpacing: '-0.03em',
}));

export const FooterLink = styled('button')(({ theme }) => ({
  appearance: 'none',
  border: 0,
  background: 'transparent',
  textAlign: 'left',
  padding: 0,
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  fontWeight: 700,
  lineHeight: 1.7,
  transition: 'color 130ms ease',
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));

export const FooterBottom = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
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
  paddingTop: theme.spacing(2.25),
  paddingBottom: theme.spacing(2.25),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
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
  padding: theme.spacing(0.6, 0.9),
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
  gap: theme.spacing(1),
}));

export const MarketingNavPill = styled(Stack)(({ theme }) => ({
  paddingLeft: theme.spacing(1.15),
  paddingRight: theme.spacing(1.15),
  paddingTop: theme.spacing(0.85),
  paddingBottom: theme.spacing(0.85),
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.14)',
  backgroundColor: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(14px)',
  alignItems: 'center',
  flexDirection: 'row',
  gap: theme.spacing(0.5),
}));