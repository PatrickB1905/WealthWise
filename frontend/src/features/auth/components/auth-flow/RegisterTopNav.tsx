import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import BrandLogo from '@shared/ui/layout/BrandLogo';
import {
  MarketingNavActions,
  MarketingNavLink,
  MarketingTopNav,
  MarketingTopNavInner,
  RegisterBackButton,
} from '../../styles/auth.styles';

type Props = {
  onBackToHome: () => void;
  onGoLogin: () => void;
};

export const RegisterTopNav: React.FC<Props> = ({ onBackToHome, onGoLogin }) => {
  return (
    <MarketingTopNav>
      <MarketingTopNavInner maxWidth="lg">
        <BrandLogo variant="marketing" href="/" height={36} />

        <MarketingNavActions>
          <RegisterBackButton size="small" startIcon={<ArrowBackIcon />} onClick={onBackToHome}>
            Back to home
          </RegisterBackButton>

          <MarketingNavLink onClick={onGoLogin} aria-label="Go to login">
            Log in
          </MarketingNavLink>
        </MarketingNavActions>
      </MarketingTopNavInner>
    </MarketingTopNav>
  );
};