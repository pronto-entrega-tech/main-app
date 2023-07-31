import { useCallback, useState } from 'react';

export type ModalState = {
  isVisible: boolean;
  onDismiss: () => void;
};

export const useModalState = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const state: ModalState = {
    isVisible: isModalOpen,
    onDismiss: () => setModalOpen(false),
  };

  return [
    state,
    useCallback(() => setModalOpen(true), []),
    useCallback(() => setModalOpen(false), []),
  ] as const;
};
