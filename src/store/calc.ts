import { calc } from '@/types/practice/calc';
import { create } from 'zustand'

interface CalcMode {
  mode: calc;
  setMode: (mode: calc) => void;
}

export const useCalcModeModalStore = create<CalcMode>((set) => ({
  mode: "none",
  setMode: (mode: calc) => set(() => ({ mode }))
}));
