import type { Key, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useInstrumentSearch, type InstrumentSearchResult } from '@features/market-data';

import { formatInstrumentInputValue } from './InstrumentAutocomplete.utils';

type Props = {
  label: ReactNode;
  inputValue: string;
  selectedInstrument: InstrumentSearchResult | null;
  error?: boolean;
  helperText?: string;
  onInputChange: (value: string) => void;
  onSelectionChange: (value: InstrumentSearchResult | null) => void;
};

const filterOptions = createFilterOptions<InstrumentSearchResult>({
  stringify: (option) =>
    `${option.symbol} ${option.name} ${option.exchange ?? ''} ${option.assetType ?? ''}`.trim(),
});

function getInstrumentPrimaryLabel(option: InstrumentSearchResult): string {
  return option.symbol;
}

function getInstrumentSecondaryLabel(option: InstrumentSearchResult): string {
  const parts = [
    option.name,
    option.exchange ? `• ${option.exchange}` : '',
    option.assetType ? `• ${option.assetType}` : '',
  ].filter(Boolean);

  return parts.join(' ');
}

function getFallbackLogoText(option: InstrumentSearchResult): string {
  return option.symbol.slice(0, 1).toUpperCase() || '?';
}

function hasLogoUrl(option: InstrumentSearchResult): boolean {
  return option.logoUrl.trim().length > 0;
}

function getOptionKey(props: object): Key | undefined {
  return (props as { key?: Key }).key;
}

function withoutReactKey<T extends object>(props: T): T {
  const copy = { ...props } as T & { key?: Key };
  delete copy.key;
  return copy;
}

function SelectedInstrumentAdornment({
  instrument,
  broken,
  onLogoError,
}: {
  instrument: InstrumentSearchResult;
  broken: boolean;
  onLogoError: () => void;
}) {
  const showImage = hasLogoUrl(instrument) && !broken;

  return (
    <InputAdornment position="start" sx={{ mr: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Avatar
          src={showImage ? instrument.logoUrl : undefined}
          alt={`${instrument.symbol} logo`}
          sx={{ width: 24, height: 24, fontSize: 11, flexShrink: 0 }}
          slotProps={{
            img: {
              referrerPolicy: 'no-referrer',
              loading: 'lazy',
              onError: onLogoError,
            },
          }}
        >
          {getFallbackLogoText(instrument)}
        </Avatar>

        <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" fontWeight={700} noWrap lineHeight={1.1}>
            {instrument.symbol}
          </Typography>
        </Box>
      </Box>
    </InputAdornment>
  );
}

export function InstrumentAutocomplete({
  label,
  inputValue,
  selectedInstrument,
  error = false,
  helperText = '',
  onInputChange,
  onSelectionChange,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [brokenLogoSymbols, setBrokenLogoSymbols] = useState<Record<string, true>>({});

  const effectiveQuery = useMemo(() => {
    if (selectedInstrument && inputValue === formatInstrumentInputValue(selectedInstrument)) {
      return '';
    }
    return inputValue;
  }, [inputValue, selectedInstrument]);

  const isShowingSelectedValue = useMemo(() => {
    return (
      selectedInstrument !== null &&
      inputValue === formatInstrumentInputValue(selectedInstrument)
    );
  }, [inputValue, selectedInstrument]);

  const { data: options = [], isFetching } = useInstrumentSearch(effectiveQuery, {
    enabled: isFocused,
  });

  const markLogoBroken = (symbol: string) => {
    setBrokenLogoSymbols((prev) => {
      if (prev[symbol]) {
        return prev;
      }
      return { ...prev, [symbol]: true };
    });
  };

  const handleLogoError =
    (symbol: string) =>
    (): void => {
      markLogoBroken(symbol);
    };

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      blurOnSelect
      clearOnBlur={false}
      filterOptions={filterOptions}
      options={options}
      value={selectedInstrument}
      inputValue={inputValue}
      isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : formatInstrumentInputValue(option)
      }
      noOptionsText={
        effectiveQuery.trim().length < 2
          ? 'Type at least 2 characters to search'
          : 'No matching instruments found'
      }
      loading={isFetching}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onInputChange={(event, value, reason) => {
        void event;
        if (reason === 'input' || reason === 'clear') {
          onInputChange(value);
        }
      }}
      onChange={(_, value) => {
        onSelectionChange(value);
        onInputChange(value ? formatInstrumentInputValue(value) : '');
      }}
      renderOption={(props, option) => {
        const optionKey = getOptionKey(props);
        const optionProps = withoutReactKey(props);
        const shouldShowImage = hasLogoUrl(option) && !brokenLogoSymbols[option.symbol];

        return (
          <Box
            key={optionKey}
            component="li"
            {...optionProps}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <Avatar
              src={shouldShowImage ? option.logoUrl : undefined}
              alt={`${option.symbol} logo`}
              sx={{ width: 28, height: 28, fontSize: 12, flexShrink: 0 }}
              slotProps={{
                img: {
                  referrerPolicy: 'no-referrer',
                  loading: 'lazy',
                  onError: handleLogoError(option.symbol),
                },
              }}
            >
              {getFallbackLogoText(option)}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {getInstrumentPrimaryLabel(option)}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {getInstrumentSecondaryLabel(option)}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => {
        const selectedStartAdornment =
          selectedInstrument && isShowingSelectedValue ? (
            <SelectedInstrumentAdornment
              instrument={selectedInstrument}
              broken={Boolean(brokenLogoSymbols[selectedInstrument.symbol])}
              onLogoError={() => markLogoBroken(selectedInstrument.symbol)}
            />
          ) : null;

        return (
          <TextField
            {...params}
            margin="dense"
            label={label}
            error={error}
            helperText={helperText}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <>
                    {selectedStartAdornment}
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {isFetching ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
    />
  );
}