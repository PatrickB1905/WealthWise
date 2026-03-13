import theme from './index';

describe('shared/theme', () => {
  it('exports the expected palette and shape defaults', () => {
    expect(theme.palette.mode).toBe('light');
    expect(theme.palette.primary.main).toBe('#2563EB');
    expect(theme.palette.background.default).toBe('#F6F8FC');
    expect(theme.shape.borderRadius).toBe(14);
  });

  it('configures important component defaults', () => {
    expect(theme.components?.MuiContainer?.defaultProps?.maxWidth).toBe('lg');
    expect(theme.components?.MuiAppBar?.defaultProps?.elevation).toBe(0);
    expect(theme.components?.MuiButton?.defaultProps?.disableElevation).toBe(true);
    expect(theme.components?.MuiTooltip?.defaultProps?.arrow).toBe(true);
    expect(theme.components?.MuiTextField?.defaultProps?.variant).toBe('outlined');
  });

  it('defines custom shadows array', () => {
    expect(theme.shadows.length).toBe(25);
    expect(theme.shadows[1]).toContain('rgba');
  });
});