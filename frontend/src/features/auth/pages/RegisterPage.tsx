import React from 'react';

import { HeroOverlay, HeroSection } from '../styles/auth.styles';

import { useRegisterPage } from '../hooks/useRegisterPage';
import { RegisterTopNav } from '../components/auth-flow/RegisterTopNav';
import { RegisterCard } from '../components/auth-flow/RegisterCard';

const RegisterPage: React.FC = () => {
  const vm = useRegisterPage();

  return (
    <HeroSection>
      <HeroOverlay />

      <RegisterTopNav onBackToHome={vm.goHome} onGoLogin={vm.goLogin} />
      <RegisterCard vm={vm} />
    </HeroSection>
  );
};

export default RegisterPage;
