import type { SxProps, Theme } from '@mui/material/styles';

export type HomePageStyles = {
  heroTitleSx: SxProps<Theme>;
  heroTaglineSx: SxProps<Theme>;
};

export function buildHomePageStyles(): HomePageStyles {
  return {
    heroTitleSx: {
      fontWeight: 950,
      letterSpacing: '-0.055em',
      lineHeight: 1.02,
      fontSize: { xs: 44, sm: 58, md: 70 },
    },
    heroTaglineSx: {
      maxWidth: 700,
      fontSize: { xs: 16.5, sm: 18, md: 18.5 },
      lineHeight: 1.6,
    },
  };
}