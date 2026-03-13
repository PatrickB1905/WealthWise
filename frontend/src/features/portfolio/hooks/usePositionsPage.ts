import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import API from '@shared/lib/axios';

import { usePositionWS } from '@features/portfolio/hooks/usePositionWS';
import { useQuotes, type RemoteQuote } from '@features/market-data';

import { EMPTY_POSITIONS } from '../constants/positions';
import type { Position } from '../types/position';
import { normalizeSymbol } from '../utils/format';

import { usePositionDialogs } from './usePositionDialogs';
import { usePositionForm } from './usePositionForm';
import { usePositionMutations } from './usePositionMutations';
import {
  validateBuyDate,
  validateBuyPrice,
  validateQuantity,
  validateSellDate,
  validateSellPrice,
  validateTicker,
} from './usePositionValidation';
import { usePositionsPricing } from './usePositionsPricing';
import { usePositionsQuoteAlert } from './usePositionsQuoteAlert';
import type { PositionsPageVM, ToastSeverity, ToastState, Tab } from './usePositionsPage.types';

export function usePositionsPage(isMobile: boolean): PositionsPageVM {
  usePositionWS();

  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('open');

  const dialogs = usePositionDialogs();
  const form = usePositionForm();

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: ToastSeverity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const positionsQuery = useQuery<Position[], Error>({
    queryKey: ['positions', tab],
    queryFn: () => API.get(`/positions?status=${tab}`).then((r) => r.data as Position[]),
    placeholderData: (prev) => prev ?? EMPTY_POSITIONS,
    refetchOnWindowFocus: false,
  });

  const positions = positionsQuery.data ?? EMPTY_POSITIONS;
  const posLoading = positionsQuery.isLoading;
  const posError = positionsQuery.error;

  const tickers = useMemo(() => positions.map((p) => p.ticker), [positions]);
  const quotesResult = useQuotes(tickers);

  const quotesArray = useMemo<RemoteQuote[]>(() => quotesResult.data ?? [], [quotesResult.data]);
  const quotesLoading = quotesResult.isLoading;

  const quotesMap = useMemo<Record<string, RemoteQuote>>(() => {
    const map: Record<string, RemoteQuote> = {};
    for (const quote of quotesArray) {
      map[normalizeSymbol(quote.symbol)] = quote;
    }
    return map;
  }, [quotesArray]);

  const pricingState = usePositionsPricing({
    positions,
    quotesMap,
    tab,
  });

  const showQuoteAlert = usePositionsQuoteAlert({
    tab,
    quotesLoading,
    missingQuotes: pricingState.pricing.missingQuotes,
  });

  const mutations = usePositionMutations({
    qc,
    tab,
    selected: dialogs.selected,
    dialogs: {
      setAddOpen: dialogs.setAddOpen,
      setCloseOpen: dialogs.setCloseOpen,
      setEditOpen: dialogs.setEditOpen,
      setDeleteOpen: dialogs.setDeleteOpen,
      setSelected: dialogs.setSelected,
    },
    form: {
      setSelectedInstrument: form.setSelectedInstrument,
      setNewTicker: form.setNewTicker,
      setTickerError: form.setTickerError,
    },
    showToast,
  });

  const loading = posLoading || (quotesLoading && tab === 'open');
  const errorText = posError?.message;

  const openAddDialog = () => {
    form.resetAddForm();
    dialogs.openAddDialog();
  };

  const openCloseDialog = (position: Position) => {
    dialogs.openCloseDialog(position);
    form.prepareCloseForm();
  };

  const openEditDialog = (position: Position) => {
    dialogs.openEditDialog(position);
    form.prepareEditForm(position, tab);
  };

  const openDeleteDialog = (position: Position) => {
    dialogs.openDeleteDialog(position);
  };

  const closeAddDialog = () => {
    dialogs.closeAddDialog();
    form.clearAddErrors();
    form.setSelectedInstrument(null);
  };

  const closeCloseDialog = () => {
    dialogs.closeCloseDialog();
    form.clearCloseErrors();
  };

  const closeEditDialog = () => {
    dialogs.closeEditDialog();
    form.clearEditErrors();
  };

  const closeDeleteDialog = () => {
    dialogs.closeDeleteDialog();
  };

  const onAddSubmit = () => {
    const tickerResult = validateTicker(form.selectedInstrument);
    form.setTickerError(tickerResult.error);
    if (tickerResult.value === null) return;

    const quantityResult = validateQuantity(form.newQuantity);
    form.setQuantityError(quantityResult.error);
    if (quantityResult.value === null) return;

    const buyPriceResult = validateBuyPrice(form.newBuyPrice);
    form.setBuyPriceError(buyPriceResult.error);
    if (buyPriceResult.value === null) return;

    const buyDateResult = validateBuyDate(form.newBuyDate);
    form.setBuyDateError(buyDateResult.error);
    if (buyDateResult.value === null) return;

    mutations.addPosition.mutate({
      ticker: tickerResult.value,
      quantity: quantityResult.value,
      buyPrice: buyPriceResult.value,
      buyDate: buyDateResult.value,
    });
  };

  const onCloseSubmit = () => {
    if (!dialogs.selected) return;

    const sellPriceResult = validateSellPrice(form.newSellPrice);
    form.setSellPriceError(sellPriceResult.error);
    if (sellPriceResult.value === null) return;

    const sellDateResult = validateSellDate(form.newSellDate);
    form.setSellDateError(sellDateResult.error);
    if (sellDateResult.value === null) return;

    mutations.closePosition.mutate({
      id: dialogs.selected.id,
      sellPrice: sellPriceResult.value,
      sellDate: sellDateResult.value,
    });
  };

  const onEditSubmit = () => {
    if (!dialogs.selected) return;

    const quantityResult = validateQuantity(form.newQuantity);
    form.setQuantityError(quantityResult.error);
    if (quantityResult.value === null) return;

    const buyPriceResult = validateBuyPrice(form.newBuyPrice);
    form.setBuyPriceError(buyPriceResult.error);
    if (buyPriceResult.value === null) return;

    const buyDateResult = validateBuyDate(form.newBuyDate);
    form.setBuyDateError(buyDateResult.error);
    if (buyDateResult.value === null) return;

    let closedFields: { sellPrice?: number; sellDate?: string } = {};
    if (tab === 'closed') {
      const sellPriceResult = validateSellPrice(form.newSellPrice);
      form.setSellPriceError(sellPriceResult.error);
      if (sellPriceResult.value === null) return;

      const sellDateResult = validateSellDate(form.newSellDate);
      form.setSellDateError(sellDateResult.error);
      if (sellDateResult.value === null) return;

      closedFields = {
        sellPrice: sellPriceResult.value,
        sellDate: sellDateResult.value,
      };
    }

    mutations.editPosition.mutate({
      id: dialogs.selected.id,
      quantity: quantityResult.value,
      buyPrice: buyPriceResult.value,
      buyDate: buyDateResult.value,
      ...closedFields,
    });
  };

  const onDeleteConfirm = () => {
    if (!dialogs.selected) return;
    mutations.deletePosition.mutate(dialogs.selected.id);
  };

  return {
    tab,
    setTab,

    positions,
    quotesMap,
    loading,
    errorText,

    pricing: pricingState.pricing,
    totalsProfitTone: pricingState.totalsProfitTone,
    totalsPctTone: pricingState.totalsPctTone,
    headerSubtitle: pricingState.headerSubtitle,
    listSubtitle: pricingState.listSubtitle,
    showQuoteAlert,
    isMobile,

    addOpen: dialogs.addOpen,
    closeOpen: dialogs.closeOpen,
    editOpen: dialogs.editOpen,
    deleteOpen: dialogs.deleteOpen,
    selected: dialogs.selected,

    newTicker: form.newTicker,
    selectedInstrument: form.selectedInstrument,
    newQuantity: form.newQuantity,
    newBuyPrice: form.newBuyPrice,
    newBuyDate: form.newBuyDate,
    newSellPrice: form.newSellPrice,
    newSellDate: form.newSellDate,
    tickerError: form.tickerError,
    quantityError: form.quantityError,
    buyPriceError: form.buyPriceError,
    buyDateError: form.buyDateError,
    sellPriceError: form.sellPriceError,
    sellDateError: form.sellDateError,

    setNewTicker: form.setNewTicker,
    setSelectedInstrument: form.setSelectedInstrument,
    setNewQuantity: form.setNewQuantity,
    setNewBuyPrice: form.setNewBuyPrice,
    setNewBuyDate: form.setNewBuyDate,
    setNewSellPrice: form.setNewSellPrice,
    setNewSellDate: form.setNewSellDate,

    openAddDialog,
    openCloseDialog,
    openEditDialog,
    openDeleteDialog,
    closeAddDialog,
    closeCloseDialog,
    closeEditDialog,
    closeDeleteDialog,

    onAddSubmit,
    onCloseSubmit,
    onEditSubmit,
    onDeleteConfirm,

    isAdding: mutations.addPosition.isPending,
    isClosing: mutations.closePosition.isPending,
    isEditing: mutations.editPosition.isPending,
    isDeleting: mutations.deletePosition.isPending,

    toast,
    closeToast,
  };
}

export type {
  PositionsPageVM,
  PricingTotals,
  ToastSeverity,
  ToastState,
  Tab,
} from './usePositionsPage.types';