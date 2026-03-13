import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { LoginTopNav } from './LoginTopNav';

describe('LoginTopNav', () => {
  it('renders navigation actions and wires interactions', async () => {
    const user = userEvent.setup();
    const onBackToHome = jest.fn();
    const onCreateAccount = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <LoginTopNav onBackToHome={onBackToHome} onCreateAccount={onCreateAccount} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /back to home/i }));
    await user.click(screen.getByRole('button', { name: /go to register/i }));

    expect(onBackToHome).toHaveBeenCalledTimes(1);
    expect(onCreateAccount).toHaveBeenCalledTimes(1);
  });
});