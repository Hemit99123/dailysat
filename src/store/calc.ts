import { calc } from '@/types/sat-platform/calc';
import { create } from 'zustand'

interface CalcMode {
  mode: calc;
  setMode: (mode: calc) => void;
}

export const useCalcModeModalStore = create<CalcMode>((set) => ({
  mode: "none",
  setMode: (mode: calc) => set(() => ({ mode }))
}));
