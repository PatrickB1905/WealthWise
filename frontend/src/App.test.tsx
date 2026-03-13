import { render, screen } from '@testing-library/react';

import App from './App';

jest.mock('./app/routes/AppRouter', () => ({
  __esModule: true,
  default: () => <div data-testid="app-router">router</div>,
}));

describe('App', () => {
  it('renders the application router', () => {
    render(<App />);

    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });
});