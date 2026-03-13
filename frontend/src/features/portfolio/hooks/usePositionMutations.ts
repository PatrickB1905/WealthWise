import type { Dispatch, SetStateAction } from 'react';
import { useMutation, type QueryClient } from '@tanstack/react-query';

import API from '@shared/lib/axios';
import type { InstrumentSearchResult } from '@features/market-data';

import type { Position } from '../types/position';
import { normalizeSymbol } from '../utils/format';
import type { Tab, ToastSeverity } from './usePositionsPage.types';
import { extractApiErrorDetail } from './usePositionValidation';

type UsePositionMutationsArgs = {
  qc: QueryClient;
  tab: Tab;
  selected: Position | null;
  dialogs: {
    setAddOpen: Dispatch<SetStateAction<boolean>>;
    setCloseOpen: Dispatch<SetStateAction<boolean>>;
    setEditOpen: Dispatch<SetStateAction<boolean>>;
    setDeleteOpen: Dispatch<SetStateAction<boolean>>;
    setSelected: Dispatch<SetStateAction<Position | null>>;
  };
  form: {
    setSelectedInstrument: Dispatch<SetStateAction<InstrumentSearchResult | null>>;
    setNewTicker: Dispatch<SetStateAction<string>>;
    setTickerError: Dispatch<SetStateAction<string>>;
  };
  showToast: (message: string, severity?: ToastSeverity) => void;
};

export function usePositionMutations({
  qc,
  tab,
  selected,
  dialogs,
  form,
  showToast,
}: UsePositionMutationsArgs) {
  const addPosition = useMutation<
    Position,
    Error,
    { ticker: string; quantity: number; buyPrice: number; buyDate?: string }
  >({
    mutationFn: (newPos) => API.post('/positions', newPos).then((r) => r.data as Position),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['positions', 'open'] });
      dialogs.setAddOpen(false);
      form.setSelectedInstrument(null);
      form.setNewTicker('');
      showToast(`Added ${normalizeSymbol(created.ticker)} to your portfolio.`, 'success');
    },
    onError: (error) => {
      const detail = extractApiErrorDetail(error);

      if (detail && /ticker|symbol/i.test(detail)) {
        form.setTickerError(detail);
      }

      showToast(detail ?? 'Could not add the position. Please try again.', 'error');
    },
  });

  const closePosition = useMutation<
    Position,
    Error,
    { id: number; sellPrice: number; sellDate?: string }
  >({
    mutationFn: (vars) =>
      API.put(`/positions/${vars.id}/close`, {
        sellPrice: vars.sellPrice,
        sellDate: vars.sellDate,
      }).then((r) => r.data as Position),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['positions', 'open'] });
      qc.invalidateQueries({ queryKey: ['positions', 'closed'] });
      dialogs.setCloseOpen(false);
      dialogs.setSelected(null);
      showToast(`Closed ${normalizeSymbol(updated.ticker)} successfully.`, 'success');
    },
    onError: (error) => {
      const detail = extractApiErrorDetail(error);
      showToast(detail ?? 'Could not close the position. Please try again.', 'error');
    },
  });

  const editPosition = useMutation<
    Position,
    Error,
    {
      id: number;
      quantity: number;
      buyPrice: number;
      buyDate?: string;
      sellPrice?: number;
      sellDate?: string;
    }
  >({
    mutationFn: (vars) => API.put(`/positions/${vars.id}`, vars).then((r) => r.data as Position),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['positions', tab] });
      dialogs.setEditOpen(false);
      dialogs.setSelected(null);
      showToast(`Updated ${normalizeSymbol(updated.ticker)} successfully.`, 'success');
    },
    onError: (error) => {
      const detail = extractApiErrorDetail(error);
      showToast(detail ?? 'Could not update the position. Please try again.', 'error');
    },
  });

  const deletePosition = useMutation<void, Error, number>({
    mutationFn: (id) => API.delete(`/positions/${id}`).then(() => undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['positions', tab] });
      const symbol = selected?.ticker ? normalizeSymbol(selected.ticker) : 'position';
      dialogs.setDeleteOpen(false);
      dialogs.setSelected(null);
      showToast(`Deleted ${symbol} successfully.`, 'success');
    },
    onError: (error) => {
      const detail = extractApiErrorDetail(error);
      showToast(detail ?? 'Could not delete the position. Please try again.', 'error');
    },
  });

  return {
    addPosition,
    closePosition,
    editPosition,
    deletePosition,
  };
}