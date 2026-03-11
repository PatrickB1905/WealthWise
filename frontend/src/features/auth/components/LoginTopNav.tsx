import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import BrandLogo from '@shared/ui/layout/BrandLogo';
import {
  LoginBackButton,
  MarketingNavActions,
  MarketingNavLink,
  MarketingTopNav,
  MarketingTopNavInner,
} from './auth.styles';

type Props = {
  onBackToHome: () => void;
  onCreateAccount: () => void;
};

export const LoginTopNav: React.FC<Props> = ({ onBackToHome, onCreateAccount }) => {
  return (
    <MarketingTopNav>
      <MarketingTopNavInner maxWidth="lg">
        <BrandLogo variant="marketing" href="/" height={36} />

        <MarketingNavActions>
          <LoginBackButton size="small" startIcon={<ArrowBackIcon />} onClick={onBackToHome}>
            Back to home
          </LoginBackButton>

          <MarketingNavLink onClick={onCreateAccount} aria-label="Go to register">
            Create account
          </MarketingNavLink>
        </MarketingNavActions>
      </MarketingTopNavInner>
    </MarketingTopNav>
  );
};