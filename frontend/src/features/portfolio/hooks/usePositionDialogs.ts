import { useState } from 'react';

import type { Position } from '../types/position';

export function usePositionDialogs() {
  const [addOpen, setAddOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Position | null>(null);

  const openAddDialog = () => setAddOpen(true);

  const openCloseDialog = (position: Position) => {
    setSelected(position);
    setCloseOpen(true);
  };

  const openEditDialog = (position: Position) => {
    setSelected(position);
    setEditOpen(true);
  };

  const openDeleteDialog = (position: Position) => {
    setSelected(position);
    setDeleteOpen(true);
  };

  const closeAddDialog = () => setAddOpen(false);
  const closeCloseDialog = () => setCloseOpen(false);
  const closeEditDialog = () => setEditOpen(false);
  const closeDeleteDialog = () => setDeleteOpen(false);

  return {
    addOpen,
    closeOpen,
    editOpen,
    deleteOpen,
    selected,
    setSelected,

    setAddOpen,
    setCloseOpen,
    setEditOpen,
    setDeleteOpen,

    openAddDialog,
    openCloseDialog,
    openEditDialog,
    openDeleteDialog,
    closeAddDialog,
    closeCloseDialog,
    closeEditDialog,
    closeDeleteDialog,
  };
}