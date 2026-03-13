import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@shared/theme';
import { DeleteAccountDialog } from './DeleteAccountDialog';

describe('DeleteAccountDialog', () => {
  it('does not expose dialog content when closed', () => {
    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open={false}
          onClose={jest.fn()}
          deleteError=""
          onConfirm={jest.fn()}
          isPending={false}
          onClearError={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.queryByText('Confirm account deletion')).not.toBeInTheDocument();
  });

  it('renders dialog content when open', () => {
    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open
          onClose={jest.fn()}
          deleteError=""
          onConfirm={jest.fn()}
          isPending={false}
          onClearError={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Confirm account deletion')).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to permanently delete your account/i),
    ).toBeInTheDocument();
  });

  it('shows delete error when present', () => {
    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open
          onClose={jest.fn()}
          deleteError="Failed to delete account"
          onConfirm={jest.fn()}
          isPending={false}
          onClearError={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText('Failed to delete account')).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open
          onClose={onClose}
          deleteError=""
          onConfirm={jest.fn()}
          isPending={false}
          onClearError={jest.fn()}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears error then confirms deletion', async () => {
    const user = userEvent.setup();
    const onClearError = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open
          onClose={jest.fn()}
          deleteError="Some error"
          onConfirm={onConfirm}
          isPending={false}
          onClearError={onClearError}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /^delete account$/i }));

    expect(onClearError).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables the destructive action while pending', () => {
    render(
      <ThemeProvider theme={theme}>
        <DeleteAccountDialog
          open
          onClose={jest.fn()}
          deleteError=""
          onConfirm={jest.fn()}
          isPending
          onClearError={jest.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: /deleting…/i })).toBeDisabled();
  });
});