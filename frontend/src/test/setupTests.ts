import React from 'react';
import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

process.on('unhandledRejection', (reason) => {
  const msg =
    reason instanceof Error ? reason : new Error(`UnhandledRejection: ${JSON.stringify(reason)}`);

  throw msg;
});

jest.mock('recharts', () => {
  const actual = jest.requireActual('recharts') as typeof import('recharts');

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { style: { width: 800, height: 400 } }, children),
  };
});