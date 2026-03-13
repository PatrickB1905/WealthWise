import * as home from './index';

describe('features/home/index', () => {
  it('re-exports HomePage', () => {
    expect(home.HomePage).toBeDefined();
    expect(typeof home.HomePage).toBe('function');
  });
});