import { render, screen } from '@testing-library/react';

import { QueryProvider } from './QueryProvider';

const mockDevtools = jest.fn();

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: (props: unknown) => {
    mockDevtools(props);
    return <div data-testid="react-query-devtools" />;
  },
}));

describe('QueryProvider', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  it('renders children', () => {
    process.env.NODE_ENV = 'test';

    render(
      <QueryProvider>
        <div>child content</div>
      </QueryProvider>,
    );

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('shows React Query devtools outside production', () => {
    process.env.NODE_ENV = 'test';

    render(
      <QueryProvider>
        <div>child content</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
    expect(mockDevtools).toHaveBeenCalledWith(
      expect.objectContaining({ initialIsOpen: false }),
    );
  });

  it('does not show React Query devtools in production', () => {
    process.env.NODE_ENV = 'production';

    render(
      <QueryProvider>
        <div>child content</div>
      </QueryProvider>,
    );

    expect(screen.queryByTestId('react-query-devtools')).not.toBeInTheDocument();
  });
});