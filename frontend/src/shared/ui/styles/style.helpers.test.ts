import theme from '@shared/theme';
import {
  buildStatusPillStyles,
  buildSuccessDotStyles,
  themeRadius,
  toneToColor,
} from './style.helpers';

describe('style.helpers', () => {
  it('maps tone to the correct theme color', () => {
    expect(toneToColor(theme, 'positive')).toBe(theme.palette.success.main);
    expect(toneToColor(theme, 'negative')).toBe(theme.palette.error.main);
    expect(toneToColor(theme, 'neutral')).toBe(theme.palette.text.primary);
  });

  it('computes scaled border radius from theme', () => {
    expect(themeRadius(theme, 1)).toBe(14);
    expect(themeRadius(theme, 1.5)).toBe(21);
  });

  it('falls back when border radius is invalid', () => {
    const brokenTheme = {
      ...theme,
      shape: { ...theme.shape, borderRadius: 'bad' as unknown as number },
    };

    expect(themeRadius(brokenTheme, 2, 16)).toBe(16);
  });

  it('builds reusable status pill styles', () => {
    const styles = buildStatusPillStyles(theme);

    expect(styles.display).toBe('inline-flex');
    expect(styles.alignItems).toBe('center');
    expect(styles.borderRadius).toBe(999);
    expect(String(styles.border)).toContain(theme.palette.divider);
  });

  it('builds success dot styles', () => {
    const styles = buildSuccessDotStyles(theme);

    expect(styles.width).toBe(8);
    expect(styles.height).toBe(8);
    expect(styles.borderRadius).toBe(999);
    expect(styles.backgroundColor).toBe(theme.palette.success.main);
  });
});