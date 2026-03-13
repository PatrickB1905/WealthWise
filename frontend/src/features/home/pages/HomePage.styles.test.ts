import { buildHomePageStyles } from './HomePage.styles';

describe('HomePage.styles', () => {
  it('builds stable hero style objects', () => {
    const styles = buildHomePageStyles();

    expect(styles.heroTitleSx).toEqual({
      fontWeight: 950,
      letterSpacing: '-0.055em',
      lineHeight: 1.02,
      fontSize: { xs: 44, sm: 58, md: 70 },
    });

    expect(styles.heroTaglineSx).toEqual({
      maxWidth: 700,
      fontSize: { xs: 16.5, sm: 18, md: 18.5 },
      lineHeight: 1.6,
    });
  });
});