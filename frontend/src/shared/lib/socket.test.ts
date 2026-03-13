import { ENV, STORAGE_KEYS } from '@shared/lib/env';

import {
  __resetSocketModuleForTests,
  __setIoForTests,
  getSocket,
  resetSocket,
  type SocketIoOptions,
} from './socket';

type FakeSocket = {
  on: jest.Mock;
  emit: jest.Mock;
  disconnect: jest.Mock;
};

function createFakeSocket(): FakeSocket {
  return {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
}

describe('shared/lib/socket', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    __resetSocketModuleForTests();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        origin: 'http://localhost:5173',
      },
    });
  });

  afterEach(() => {
    __resetSocketModuleForTests();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('creates a socket with websocket transport and auth payload from local storage', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token-123');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 42 }));

    __setIoForTests(ioSpy);

    const socket = getSocket();

    expect(socket).toBe(fakeSocket);
    expect(ioSpy).toHaveBeenCalledWith(
      ENV.POSITIONS_WS_URL ?? 'ws://localhost:3000',
      {
        transports: ['websocket'],
        auth: { token: 'token-123', userId: 42 },
      } satisfies SocketIoOptions,
    );
  });

  it('falls back to window.location.origin when no websocket env url exists', async () => {
    jest.resetModules();

    jest.doMock('@shared/lib/env', () => ({
      ENV: {
        POSITIONS_WS_URL: undefined,
      },
      STORAGE_KEYS: {
        TOKEN: 'ww_token',
        USER: 'ww_user',
      },
    }));

    const mod = await import('./socket');
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    mod.__setIoForTests(ioSpy);

    mod.getSocket();

    expect(ioSpy).toHaveBeenCalledWith('http://localhost:5173', {
      transports: ['websocket'],
      auth: { token: null, userId: undefined },
    });

    mod.__resetSocketModuleForTests();
  });

  it('reuses the same socket instance across calls until reset', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    __setIoForTests(ioSpy);

    const first = getSocket();
    const second = getSocket();

    expect(first).toBe(second);
    expect(ioSpy).toHaveBeenCalledTimes(1);
  });

  it('registers a connect handler that joins the current user room when user id exists', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 42 }));
    __setIoForTests(ioSpy);

    getSocket();

    expect(fakeSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));

    const connectHandler = fakeSocket.on.mock.calls.find(([event]) => event === 'connect')?.[1] as
      | (() => void)
      | undefined;

    expect(connectHandler).toBeDefined();

    connectHandler?.();

    expect(fakeSocket.emit).toHaveBeenCalledWith('join', 42);
  });

  it('does not emit join on connect when user id is missing', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ email: 'john@example.com' }));
    __setIoForTests(ioSpy);

    getSocket();

    const connectHandler = fakeSocket.on.mock.calls.find(([event]) => event === 'connect')?.[1] as
      | (() => void)
      | undefined;

    connectHandler?.();

    expect(fakeSocket.emit).not.toHaveBeenCalled();
  });

  it('handles invalid stored user json safely', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    localStorage.setItem(STORAGE_KEYS.USER, '{not-json');
    __setIoForTests(ioSpy);

    getSocket();

    expect(ioSpy).toHaveBeenCalledWith(
      ENV.POSITIONS_WS_URL ?? 'ws://localhost:3000',
      {
        transports: ['websocket'],
        auth: { token: null, userId: undefined },
      },
    );
  });

  it('disconnects and clears the socket on reset', () => {
    const fakeSocket = createFakeSocket();
    const ioSpy = jest.fn().mockReturnValue(fakeSocket);

    __setIoForTests(ioSpy);

    getSocket();
    resetSocket();

    expect(fakeSocket.disconnect).toHaveBeenCalledTimes(1);

    getSocket();
    expect(ioSpy).toHaveBeenCalledTimes(2);
  });
});