import React from 'react';

import wealthwiseDarkPrimary from '@assets/images/branding/wealthwise-dark-primary.png';
import wealthwiseLightPrimary from '@assets/images/branding/wealthwise-light-primary.png';

import { BrandLogoImage, BrandLogoLink } from '../styles/brand.styles';

type BrandLogoVariant = 'marketing' | 'sidebar';

type BrandLogoProps = {
  variant: BrandLogoVariant;
  height?: number;
  href?: string;
  alt?: string;
};

const logoByVariant: Record<BrandLogoVariant, string> = {
  marketing: wealthwiseDarkPrimary,
  sidebar: wealthwiseLightPrimary,
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  variant,
  height,
  href,
  alt = 'WealthWise',
}) => {
  const resolvedHeight = height ?? (variant === 'sidebar' ? 34 : 36);
  const src = logoByVariant[variant];

  const logo = (
    <BrandLogoImage
      src={src}
      alt={alt}
      draggable={false}
      logoVariant={variant}
      resolvedHeight={resolvedHeight}
    />
  );

  if (href) {
    return (
      <BrandLogoLink href={href} aria-label="WealthWise home">
        {logo}
      </BrandLogoLink>
    );
  }

  return logo;
};

export default BrandLogo;