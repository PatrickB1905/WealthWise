import { act, screen } from '@testing-library/react';

import { renderWithProviders } from '@test/renderWithProviders';
import { PositionsToast } from './PositionsToast';

describe('PositionsToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders open toast message', () => {
    renderWithProviders(
      <PositionsToast
        toast={{
          open: true,
          message: 'Position added',
          severity: 'success',
        }}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByText('Position added')).toBeInTheDocument();
  });

  it('calls onClose after auto hide', () => {
    const onClose = jest.fn();

    renderWithProviders(
      <PositionsToast
        toast={{
          open: true,
          message: 'Position added',
          severity: 'success',
        }}
        onClose={onClose}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(3200);
    });

    expect(onClose).toHaveBeenCalled();
  });
});