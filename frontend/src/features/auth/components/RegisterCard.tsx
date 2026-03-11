import React from 'react';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { AuthContainer, AuthPaper, FormFooter, FormHeader } from './auth.styles';
import { RegisterForm } from './RegisterForm';
import type { UseRegisterPageReturn } from '../hooks/useRegisterPage';

type Props = {
  vm: UseRegisterPageReturn;
};

export const RegisterCard: React.FC<Props> = ({ vm }) => {
  return (
    <AuthContainer maxWidth="xs">
      <AuthPaper>
        <FormHeader>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.7rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              mb: 0.75,
            }}
          >
            Create your account
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: '0.875rem',
              lineHeight: 1.45,
              maxWidth: 420,
              mx: 'auto',
            }}
          >
            Access portfolio analytics, performance insights, and market intelligence in one place.
          </Typography>
        </FormHeader>

        {vm.error ? (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              py: 0.5,
              '& .MuiAlert-message': {
                fontSize: '0.8125rem',
                lineHeight: 1.4,
              },
            }}
          >
            {vm.error}
          </Alert>
        ) : null}

        <RegisterForm
          firstName={vm.firstName}
          onFirstNameChange={vm.setFirstName}
          firstOk={vm.firstOk}
          lastName={vm.lastName}
          onLastNameChange={vm.setLastName}
          lastOk={vm.lastOk}
          email={vm.email}
          onEmailChange={vm.setEmail}
          emailOk={vm.emailOk}
          password={vm.password}
          onPasswordChange={vm.setPassword}
          passwordOk={vm.passwordOk}
          acceptTerms={vm.acceptTerms}
          onAcceptTermsChange={vm.setAcceptTerms}
          showPassword={vm.showPassword}
          onToggleShowPassword={vm.toggleShowPassword}
          touched={vm.touched}
          onBlur={vm.markTouched}
          submitting={vm.submitting}
          canSubmit={vm.canSubmit}
          onSubmit={vm.handleSubmit}
        />

        <Divider sx={{ my: 1.5 }} />

        <FormFooter>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account? Log in
          </Link>
        </FormFooter>
      </AuthPaper>
    </AuthContainer>
  );
};