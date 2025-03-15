import { calc } from '@/types/sat-platform/calc';
import { create } from 'zustand'

interface ModalProps {
    isOpen: boolean
    openModal: () => void;
    closeModal: () => void;
}

interface CalcMode {
  mode: calc;
  setMode: (mode: calc) => void;
}

export const useStreakAnnouncerModalStore = create<ModalProps>((set) => ({
  isOpen: false,
  openModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set(() => ({ isOpen: false }))
}))

export const useCalcOptionModalStore = create<ModalProps>((set) => ({
  isOpen: false,
  openModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set(() => ({ isOpen: false }))
}))

export const useCalcModeModalStore = create<CalcMode>((set) => ({
  mode: "none",
  setMode: (mode: calc) => set(() => ({ mode }))
}));
