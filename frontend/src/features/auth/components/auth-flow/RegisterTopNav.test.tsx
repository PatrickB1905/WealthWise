import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { RegisterTopNav } from './RegisterTopNav';

describe('RegisterTopNav', () => {
  it('renders navigation actions and wires interactions', async () => {
    const user = userEvent.setup();
    const onBackToHome = jest.fn();
    const onGoLogin = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <RegisterTopNav onBackToHome={onBackToHome} onGoLogin={onGoLogin} />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /back to home/i }));
    await user.click(screen.getByRole('button', { name: /go to login/i }));

    expect(onBackToHome).toHaveBeenCalledTimes(1);
    expect(onGoLogin).toHaveBeenCalledTimes(1);
  });
});