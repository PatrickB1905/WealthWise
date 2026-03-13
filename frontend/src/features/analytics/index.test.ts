import * as analytics from './index';

describe('features/analytics/index', () => {
  it('re-exports AnalyticsPage', () => {
    expect(analytics.AnalyticsPage).toBeDefined();
    expect(typeof analytics.AnalyticsPage).toBe('function');
  });
});