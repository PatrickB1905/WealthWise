import {
  AREA_FILL_ID,
  BENCHMARKS,
  CHART_Y_AXIS_WIDTH,
  DAY_WINDOWS,
  DEFAULT_BENCHMARK,
  DEFAULT_DAYS,
  DEFAULT_RANGE_MONTHS,
  RANGE_OPTIONS,
} from './constants';

describe('analytics constants', () => {
  it('exports stable range options', () => {
    expect(RANGE_OPTIONS).toEqual([
      { label: '12 M', months: 12 },
      { label: '6 M', months: 6 },
      { label: '3 M', months: 3 },
    ]);
  });

  it('exports stable benchmarks and defaults', () => {
    expect(BENCHMARKS).toEqual(['SPY', 'QQQ', 'IWM']);
    expect(DEFAULT_BENCHMARK).toBe('SPY');
    expect(DEFAULT_DAYS).toBe(30);
    expect(DEFAULT_RANGE_MONTHS).toBe(12);
  });

  it('exports stable day windows and chart constants', () => {
    expect(DAY_WINDOWS).toEqual([
      { label: '30D', days: 30 },
      { label: '90D', days: 90 },
      { label: '180D', days: 180 },
      { label: '365D', days: 365 },
    ]);

    expect(CHART_Y_AXIS_WIDTH).toBe(68);
    expect(AREA_FILL_ID).toBe('ww_area_fill');
  });
});