import React from 'react';

import { HeroOverlay, HeroSection } from '../components/auth.styles';

import { useLoginPage } from '../hooks/useLoginPage';
import { LoginTopNav } from '../components/LoginTopNav';
import { LoginCard } from '../components/LoginCard';

const LoginPage: React.FC = () => {
  const vm = useLoginPage();

  return (
    <HeroSection>
      <HeroOverlay />

      <LoginTopNav onBackToHome={vm.goHome} onCreateAccount={vm.goRegister} />
      <LoginCard vm={vm} />
    </HeroSection>
  );
};

export default LoginPage;
