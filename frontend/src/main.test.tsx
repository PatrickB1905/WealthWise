import React from 'react';

const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender,
}));

jest.mock('react-dom/client', () => ({
  __esModule: true,
  default: {
    createRoot: mockCreateRoot,
  },
}));

jest.mock('./App', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@app/providers/AppProviders', () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => children,
}));

describe('main.tsx', () => {
  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<div id="root"></div>';
    mockCreateRoot.mockClear();
    mockRender.mockClear();
  });

  it('mounts the app into the root element', async () => {
    await import('./main');

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});