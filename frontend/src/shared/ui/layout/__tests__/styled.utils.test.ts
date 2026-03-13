import {
  ROUTE_TRANSITION_MS,
  SIDEBAR_WIDTH,
  dashboardTitleFromPath,
} from '../styled.utils';

describe('styled.utils', () => {
  it('exposes stable layout constants', () => {
    expect(SIDEBAR_WIDTH).toBe(272);
    expect(ROUTE_TRANSITION_MS).toBe(260);
  });

  describe('dashboardTitleFromPath', () => {
    it('returns Portfolio for positions paths', () => {
      expect(dashboardTitleFromPath('/app/positions')).toBe('Portfolio');
      expect(dashboardTitleFromPath('/app/positions/123')).toBe('Portfolio');
    });

    it('returns Analytics for analytics paths', () => {
      expect(dashboardTitleFromPath('/app/analytics')).toBe('Analytics');
    });

    it('returns News for news paths', () => {
      expect(dashboardTitleFromPath('/app/news')).toBe('News');
    });

    it('returns My Profile for profile paths', () => {
      expect(dashboardTitleFromPath('/app/profile')).toBe('My Profile');
    });

    it('falls back to Dashboard for unknown paths', () => {
      expect(dashboardTitleFromPath('/something-else')).toBe('Dashboard');
    });
  });
});