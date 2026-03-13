type RequestFulfilled = (config: { headers?: unknown }) => { headers?: unknown } | Promise<{ headers?: unknown }>;
type ResponseRejected = (error: unknown) => Promise<never>;

const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();
const mockCreate = jest.fn();

jest.mock('axios', () => {
  const actual = jest.requireActual('axios');

  return {
    __esModule: true,
    ...actual,
    default: {
      ...actual.default,
      create: (...args: unknown[]) => mockCreate(...args),
    },
  };
});

import { AUTH_EVENTS, __resetUnauthorizedForTests, createHttpClient, getErrorMessage } from './http';
import { STORAGE_KEYS } from './env';

describe('shared/lib/http', () => {
  let capturedRequestFulfilled: RequestFulfilled | undefined;
  let capturedResponseRejected: ResponseRejected | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    localStorage.clear();
    __resetUnauthorizedForTests();

    capturedRequestFulfilled = undefined;
    capturedResponseRejected = undefined;

    mockRequestUse.mockImplementation((fulfilled: RequestFulfilled) => {
      capturedRequestFulfilled = fulfilled;
      return 0;
    });

    mockResponseUse.mockImplementation(
      (_fulfilled: unknown, rejected: ResponseRejected) => {
        capturedResponseRejected = rejected;
        return 0;
      },
    );

    mockCreate.mockImplementation((config: { baseURL: string; headers: Record<string, string> }) => ({
      defaults: {
        baseURL: config.baseURL,
        headers: config.headers,
      },
      interceptors: {
        request: {
          use: mockRequestUse,
        },
        response: {
          use: mockResponseUse,
        },
      },
    }));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function getRequestInterceptor(): RequestFulfilled {
    const client = createHttpClient('https://api.example.com');
    expect(client).toBeDefined();
    expect(capturedRequestFulfilled).toBeDefined();

    if (!capturedRequestFulfilled) {
      throw new Error('Expected request interceptor to be registered');
    }

    return capturedRequestFulfilled;
  }

  function getResponseRejectedInterceptor(): ResponseRejected {
    const client = createHttpClient('https://api.example.com');
    expect(client).toBeDefined();
    expect(capturedResponseRejected).toBeDefined();

    if (!capturedResponseRejected) {
      throw new Error('Expected response rejected interceptor to be registered');
    }

    return capturedResponseRejected;
  }

  it('creates an axios client with json defaults', () => {
    const client = createHttpClient('https://api.example.com');

    expect(client.defaults.baseURL).toBe('https://api.example.com');
    expect(client.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('adds bearer auth header when a token exists', async () => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token-123');
    const requestInterceptor = getRequestInterceptor();

    const result = await requestInterceptor({
      headers: {},
    });

    expect(
      (result.headers as { get?: (name: string) => string | undefined }).get?.('Authorization'),
    ).toBe('Bearer token-123');
  });

  it('does not add auth header when token is missing', async () => {
    const requestInterceptor = getRequestInterceptor();

    const result = await requestInterceptor({
      headers: {},
    });

    expect(
      (result.headers as { get?: (name: string) => string | undefined }).get?.('Authorization'),
    ).toBeUndefined();
  });

  it('clears auth storage and emits unauthorized event on 401', async () => {
    const listener = jest.fn();
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);

    localStorage.setItem(STORAGE_KEYS.TOKEN, 'token-123');
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: 1 }));

    const rejected = getResponseRejectedInterceptor();

    const error = {
      isAxiosError: true,
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);
  });

  it('deduplicates unauthorized event emission within the cooldown window', async () => {
    const listener = jest.fn();
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);

    const rejected = getResponseRejectedInterceptor();

    const error = {
      isAxiosError: true,
      response: { status: 401 },
    };

    await expect(rejected(error)).rejects.toBe(error);
    await expect(rejected(error)).rejects.toBe(error);

    expect(listener).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);

    await expect(rejected(error)).rejects.toBe(error);

    expect(listener).toHaveBeenCalledTimes(2);

    window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);
  });

  it('does not emit unauthorized event for non-401 axios errors', async () => {
    const listener = jest.fn();
    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);

    const rejected = getResponseRejectedInterceptor();

    const error = {
      isAxiosError: true,
      response: { status: 500 },
    };

    await expect(rejected(error)).rejects.toBe(error);

    expect(listener).not.toHaveBeenCalled();

    window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, listener);
  });

  it('prefers backend error message from axios error response data', () => {
    const err = {
      isAxiosError: true,
      response: {
        data: {
          error: 'Email already exists',
        },
      },
    };

    expect(getErrorMessage(err, 'Fallback')).toBe('Email already exists');
  });

  it('supports axios-like nested response data objects', () => {
    const err = {
      response: {
        data: {
          error: 'Current password is incorrect',
        },
      },
    };

    expect(getErrorMessage(err, 'Fallback')).toBe('Current password is incorrect');
  });

  it('falls back when error payload does not contain a usable message', () => {
    expect(getErrorMessage(new Error('boom'), 'Fallback')).toBe('Fallback');
    expect(getErrorMessage({ response: { data: { error: '   ' } } }, 'Fallback')).toBe('Fallback');
    expect(getErrorMessage(null, 'Fallback')).toBe('Fallback');
  });
});