import * as news from './index';

describe('features/news/index', () => {
  it('re-exports NewsPage', () => {
    expect(news.NewsPage).toBeDefined();
    expect(typeof news.NewsPage).toBe('function');
  });
});