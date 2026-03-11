import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';

import { BENCHMARKS, DAY_WINDOWS, type Benchmark } from '../../constants';
import { ControlsLabel, SectionContent } from '@shared/ui';
import {
  AnalyticsControlBlock,
  AnalyticsControlLabel,
  AnalyticsControlsCard,
  AnalyticsControlsGrid,
  AnalyticsFreshnessDot,
  AnalyticsFreshnessPill,
  AnalyticsFreshnessText,
  AnalyticsFreshnessWrap,
  AnalyticsLabelInline,
  AnalyticsToggleGroup,
} from '../../styles/analytics.styles';
import { InfoTip } from './AnalyticsInfoTip';

type Props = {
  benchmark: Benchmark;
  onBenchmarkChange: (next: Benchmark) => void;
  days: number;
  onDaysChange: (next: number) => void;
  updatedLabel: string;
};

export const AnalyticsControls: React.FC<Props> = ({
  benchmark,
  onBenchmarkChange,
  days,
  onDaysChange,
  updatedLabel,
}) => {
  return (
    <AnalyticsControlsCard>
      <SectionContent>
        <AnalyticsControlsGrid>
          {/* Benchmark */}
          <AnalyticsControlBlock>
            <AnalyticsControlLabel variant="caption">
              <AnalyticsLabelInline>
                Benchmark
                <InfoTip
                  ariaLabel="Benchmark info"
                  title="Compare your portfolio’s risk metrics to this ETF proxy (e.g., SPY = S&P 500)."
                />
              </AnalyticsLabelInline>
            </AnalyticsControlLabel>

            <AnalyticsToggleGroup
              value={benchmark}
              exclusive
              onChange={(_, val: Benchmark | null) => {
                if (val) onBenchmarkChange(val);
              }}
              aria-label="benchmark"
            >
              {BENCHMARKS.map((b) => (
                <ToggleButton key={b} value={b}>
                  {b}
                </ToggleButton>
              ))}
            </AnalyticsToggleGroup>
          </AnalyticsControlBlock>

          {/* Window */}
          <AnalyticsControlBlock>
            <AnalyticsControlLabel variant="caption">
              <AnalyticsLabelInline>
                Window
                <InfoTip
                  ariaLabel="Window info"
                  title="Controls the time window used for performance and risk metrics (e.g., 30D vs 365D)."
                />
              </AnalyticsLabelInline>
            </AnalyticsControlLabel>

            <AnalyticsToggleGroup
              value={days}
              exclusive
              onChange={(_, val: number | null) => {
                if (val) onDaysChange(val);
              }}
              aria-label="days window"
            >
              {DAY_WINDOWS.map((w) => (
                <ToggleButton key={w.days} value={w.days}>
                  {w.label}
                </ToggleButton>
              ))}
            </AnalyticsToggleGroup>
          </AnalyticsControlBlock>

          {/* Freshness */}
          <AnalyticsFreshnessWrap>
            <ControlsLabel
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <AnalyticsLabelInline>
                Freshness
                <InfoTip
                  ariaLabel="Freshness info"
                  title="Shows how recently your analytics data was refreshed. Updates automatically in the background."
                />
              </AnalyticsLabelInline>
            </ControlsLabel>

            <AnalyticsFreshnessPill>
              <AnalyticsFreshnessDot />
              <AnalyticsFreshnessText>Updated {updatedLabel}</AnalyticsFreshnessText>
            </AnalyticsFreshnessPill>
          </AnalyticsFreshnessWrap>
        </AnalyticsControlsGrid>
      </SectionContent>
    </AnalyticsControlsCard>
  );
};