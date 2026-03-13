import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';

import type { InstrumentSearchResult } from '@features/market-data';
import { formatInstrumentInputValue } from '../components/forms/InstrumentAutocomplete.utils';
import { isFiniteNumber } from '../utils/format';
import type { Position } from '../types/position';
import type { Tab } from './usePositionsPage.types';
import {
  BUY_DATE_INVALID_MESSAGE,
  BUY_PRICE_POSITIVE_MESSAGE,
  QUANTITY_ERROR_MESSAGE,
  SELL_DATE_INVALID_MESSAGE,
  SELL_PRICE_REQUIRED_MESSAGE,
  parsePositiveNumber,
  parseRequiredNumberAllowZero,
} from './usePositionValidation';

export function usePositionForm() {
  const [newTicker, setNewTicker] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentSearchResult | null>(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [newBuyPrice, setNewBuyPrice] = useState('');
  const [newBuyDate, setNewBuyDate] = useState<Dayjs | null>(dayjs());
  const [newSellPrice, setNewSellPrice] = useState('');
  const [newSellDate, setNewSellDate] = useState<Dayjs | null>(dayjs());

  const [tickerError, setTickerError] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [buyPriceError, setBuyPriceError] = useState('');
  const [buyDateError, setBuyDateError] = useState('');
  const [sellPriceError, setSellPriceError] = useState('');
  const [sellDateError, setSellDateError] = useState('');

  const clearAddErrors = () => {
    setTickerError('');
    setQuantityError('');
    setBuyPriceError('');
    setBuyDateError('');
  };

  const clearCloseErrors = () => {
    setSellPriceError('');
    setSellDateError('');
  };

  const clearEditErrors = () => {
    setQuantityError('');
    setBuyPriceError('');
    setBuyDateError('');
    setSellPriceError('');
    setSellDateError('');
  };

  const resetAddForm = () => {
    setNewTicker('');
    setSelectedInstrument(null);
    setNewQuantity('');
    setNewBuyPrice('');
    setNewBuyDate(dayjs());
    clearAddErrors();
  };

  const prepareCloseForm = () => {
    setNewSellPrice('');
    setNewSellDate(dayjs());
    clearCloseErrors();
  };

  const prepareEditForm = (position: Position, tab: Tab) => {
    setNewQuantity(String(position.quantity));
    setNewBuyPrice(String(position.buyPrice));
    setNewBuyDate(dayjs(position.buyDate));

    clearEditErrors();

    if (tab === 'closed') {
      setNewSellDate(position.sellDate ? dayjs(position.sellDate) : dayjs());
      setNewSellPrice(isFiniteNumber(position.sellPrice) ? String(position.sellPrice) : '');
      return;
    }

    setNewSellPrice('');
    setNewSellDate(dayjs());
  };

  const handleSetNewTicker = (value: string) => {
    setNewTicker(value);

    if (selectedInstrument && value !== formatInstrumentInputValue(selectedInstrument)) {
      setSelectedInstrument(null);
    }

    if (tickerError) {
      setTickerError('');
    }
  };

  const handleSetSelectedInstrument = (instrument: InstrumentSearchResult | null) => {
    setSelectedInstrument(instrument);

    if (instrument) {
      setNewTicker(formatInstrumentInputValue(instrument));
      setTickerError('');
      return;
    }

    if (!newTicker.trim()) {
      setTickerError('');
    }
  };

  const handleSetNewQuantity = (value: string) => {
    setNewQuantity(value);

    if (!value.trim()) {
      setQuantityError('');
      return;
    }

    const parsed = parsePositiveNumber(value);
    setQuantityError(parsed === null ? QUANTITY_ERROR_MESSAGE : '');
  };

  const handleSetNewBuyPrice = (value: string) => {
    setNewBuyPrice(value);

    if (!value.trim()) {
      setBuyPriceError('');
      return;
    }

    const parsed = parsePositiveNumber(value);
    setBuyPriceError(parsed === null ? BUY_PRICE_POSITIVE_MESSAGE : '');
  };

  const handleSetNewBuyDate = (value: Dayjs | null) => {
    setNewBuyDate(value);

    if (value === null) {
      setBuyDateError('');
      return;
    }

    setBuyDateError(value.isValid() ? '' : BUY_DATE_INVALID_MESSAGE);
  };

  const handleSetNewSellPrice = (value: string) => {
    setNewSellPrice(value);

    if (!value.trim()) {
      setSellPriceError('');
      return;
    }

    const parsed = parseRequiredNumberAllowZero(value);
    setSellPriceError(parsed === null ? SELL_PRICE_REQUIRED_MESSAGE : '');
  };

  const handleSetNewSellDate = (value: Dayjs | null) => {
    setNewSellDate(value);

    if (value === null) {
      setSellDateError('');
      return;
    }

    setSellDateError(value.isValid() ? '' : SELL_DATE_INVALID_MESSAGE);
  };

  return {
    newTicker,
    selectedInstrument,
    newQuantity,
    newBuyPrice,
    newBuyDate,
    newSellPrice,
    newSellDate,
    tickerError,
    quantityError,
    buyPriceError,
    buyDateError,
    sellPriceError,
    sellDateError,

    setNewTicker: handleSetNewTicker,
    setSelectedInstrument: handleSetSelectedInstrument,
    setNewQuantity: handleSetNewQuantity,
    setNewBuyPrice: handleSetNewBuyPrice,
    setNewBuyDate: handleSetNewBuyDate,
    setNewSellPrice: handleSetNewSellPrice,
    setNewSellDate: handleSetNewSellDate,

    setTickerError,
    setQuantityError,
    setBuyPriceError,
    setBuyDateError,
    setSellPriceError,
    setSellDateError,

    clearAddErrors,
    clearCloseErrors,
    clearEditErrors,
    resetAddForm,
    prepareCloseForm,
    prepareEditForm,
  };
}