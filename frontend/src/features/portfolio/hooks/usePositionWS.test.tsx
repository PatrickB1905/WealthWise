import React from 'react';
import { renderHook } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';

import { makeTestQueryClient } from '@test/testQueryClient';
import { usePositionWS } from './usePositionWS';

const mockGetSocket = jest.fn();

const fakeSocket = {
  on: jest.fn(),
  off: jest.fn(),
};

jest.mock('@shared/lib/socket', () => ({
  getSocket: () => mockGetSocket(),
}));

function createWrapper() {
  const queryClient = makeTestQueryClient();
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { Wrapper, invalidateSpy };
}

describe('usePositionWS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSocket.mockReturnValue(fakeSocket);
  });

  it('subscribes to all position change events', () => {
    const { Wrapper } = createWrapper();

    renderHook(() => usePositionWS(), {
      wrapper: Wrapper,
    });

    expect(fakeSocket.on).toHaveBeenCalledWith('position:added', expect.any(Function));
    expect(fakeSocket.on).toHaveBeenCalledWith('position:closed', expect.any(Function));
    expect(fakeSocket.on).toHaveBeenCalledWith('position:updated', expect.any(Function));
    expect(fakeSocket.on).toHaveBeenCalledWith('position:deleted', expect.any(Function));
  });

  it('invalidates positions, quotes, and analytics queries on position change', () => {
    const { Wrapper, invalidateSpy } = createWrapper();

    renderHook(() => usePositionWS(), {
      wrapper: Wrapper,
    });

    const handler = fakeSocket.on.mock.calls[0][1] as () => void;
    handler();

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['positions'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['quotes'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['analytics'] });
  });

  it('removes event listeners on unmount', () => {
    const { Wrapper } = createWrapper();

    const { unmount } = renderHook(() => usePositionWS(), {
      wrapper: Wrapper,
    });

    unmount();

    expect(fakeSocket.off).toHaveBeenCalledWith('position:added', expect.any(Function));
    expect(fakeSocket.off).toHaveBeenCalledWith('position:closed', expect.any(Function));
    expect(fakeSocket.off).toHaveBeenCalledWith('position:updated', expect.any(Function));
    expect(fakeSocket.off).toHaveBeenCalledWith('position:deleted', expect.any(Function));
  });
});