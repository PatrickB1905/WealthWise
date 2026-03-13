import type { Dayjs } from 'dayjs';

import type { InstrumentSearchResult, RemoteQuote } from '@features/market-data';
import type { Position } from '../types/position';
import type { toneFromNumber } from '../utils/format';

export type Tab = 'open' | 'closed';

export type ToastSeverity = 'success' | 'error' | 'info';

export type ToastState = {
  open: boolean;
  message: string;
  severity: ToastSeverity;
};

export type PricingTotals = {
  totalInvested: number;
  totalProfitKnown: number;
  totalProfitPctKnown: number;
  missingQuotes: number;
};

export type PositionsPageVM = {
  tab: Tab;
  setTab: (t: Tab) => void;

  positions: Position[];
  quotesMap: Record<string, RemoteQuote>;
  loading: boolean;
  errorText?: string;

  pricing: PricingTotals;
  totalsProfitTone: ReturnType<typeof toneFromNumber>;
  totalsPctTone: ReturnType<typeof toneFromNumber>;
  headerSubtitle: string;
  listSubtitle: string;
  showQuoteAlert: boolean;
  isMobile: boolean;

  addOpen: boolean;
  closeOpen: boolean;
  editOpen: boolean;
  deleteOpen: boolean;
  selected: Position | null;

  newTicker: string;
  selectedInstrument: InstrumentSearchResult | null;
  newQuantity: string;
  newBuyPrice: string;
  newBuyDate: Dayjs | null;
  newSellPrice: string;
  newSellDate: Dayjs | null;
  tickerError: string;
  quantityError: string;
  buyPriceError: string;
  buyDateError: string;
  sellPriceError: string;
  sellDateError: string;

  setNewTicker: (v: string) => void;
  setSelectedInstrument: (instrument: InstrumentSearchResult | null) => void;
  setNewQuantity: (v: string) => void;
  setNewBuyPrice: (v: string) => void;
  setNewBuyDate: (v: Dayjs | null) => void;
  setNewSellPrice: (v: string) => void;
  setNewSellDate: (v: Dayjs | null) => void;

  openAddDialog: () => void;
  openCloseDialog: (p: Position) => void;
  openEditDialog: (p: Position) => void;
  openDeleteDialog: (p: Position) => void;
  closeAddDialog: () => void;
  closeCloseDialog: () => void;
  closeEditDialog: () => void;
  closeDeleteDialog: () => void;

  onAddSubmit: () => void;
  onCloseSubmit: () => void;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;

  isAdding: boolean;
  isClosing: boolean;
  isEditing: boolean;
  isDeleting: boolean;

  toast: ToastState;
  closeToast: () => void;
};