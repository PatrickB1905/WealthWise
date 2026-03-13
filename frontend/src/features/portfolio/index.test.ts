import * as portfolio from './index';

describe('features/portfolio/index', () => {
  it('re-exports PositionsPage', () => {
    expect(portfolio.PositionsPage).toBeDefined();
    expect(typeof portfolio.PositionsPage).toBe('function');
  });
});