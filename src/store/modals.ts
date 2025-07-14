import { create } from 'zustand'

interface ModalProps {
    isOpen: boolean
    openModal: () => void;
    closeModal: () => void;
}

export const useStreakAnnouncerModalStore = create<ModalProps>((set) => ({
  isOpen: false,
  openModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set(() => ({ isOpen: false }))
}))

export const useCalculatorModalStore = create<ModalProps>((set) => ({
  isOpen: false,
  openModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set(() => ({ isOpen: false }))
}))