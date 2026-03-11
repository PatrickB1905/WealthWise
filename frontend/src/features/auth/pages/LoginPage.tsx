import React from 'react';

import { HeroOverlay, HeroSection } from '../styles/auth.styles';

import { useLoginPage } from '../hooks/useLoginPage';
import { LoginTopNav } from '../components/auth-flow/LoginTopNav';
import { LoginCard } from '../components/auth-flow/LoginCard';

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
