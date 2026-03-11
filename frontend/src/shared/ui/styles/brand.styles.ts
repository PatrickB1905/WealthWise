import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const SidebarBrandLogoWrap = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 40,
  width: '100%',
}));

export const BrandLogoImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'logoVariant' && prop !== 'resolvedHeight',
})<{
  logoVariant: 'marketing' | 'sidebar';
  resolvedHeight: number;
}>(({ theme, logoVariant, resolvedHeight }) => ({
  display: 'block',
  width: 'auto',
  objectFit: 'contain',
  userSelect: 'none',
  height: resolvedHeight,
  maxWidth: logoVariant === 'sidebar' ? 190 : 220,
  [theme.breakpoints.down('sm')]: {
    height: Math.max(28, resolvedHeight - 6),
    maxWidth: logoVariant === 'sidebar' ? 170 : 190,
  },
}));

export const BrandLogoLink = styled('a')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  lineHeight: 0,
  outline: 'none',
  boxShadow: 'none',
  WebkitTapHighlightColor: 'transparent',
  '&:focus': {
    outline: 'none',
  },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: 'none',
  },
}));