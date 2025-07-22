import { GridType } from '@/types/shop/grid';
import { create } from 'zustand';

interface GridState {
    grid: GridType;
    setGrid: (newGrid: GridType) => void;
}

export const useGridStore = create<GridState>((set) => ({
    grid: 'investor',
    setGrid: (newGrid) => set({ grid: newGrid }),
}));