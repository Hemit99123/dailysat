import { create } from 'zustand'

interface ScoreStateProps {
    score: number;
    increaseScore: () => void;
    resetScore: () => void;
}

interface Counter {
  count: number;
  increaseCount: () => void;
  resetCount: () => void;
}

// New interface for points earned
interface PointsEarnedStore {
  lastPointsEarned: number | null;
  setLastPointsEarned: (points: number | null) => void;
}

export const useScoreStore = create<ScoreStateProps>((set) => ({
  score: 0,
  increaseScore: () => set((state: { score: number }) => ({ score: state.score + 10 })),
  resetScore: () => set({ score: 0 }),
}))

export const useAnswerCounterStore = create<Counter>((set) => ({
  count: 0, 
  increaseCount: () => set((state: { count: number }) => ({ count: state.count + 1 })),
  resetCount: () => set(() => ({ count: 0}))
}))

// New store for points earned
export const usePointsEarnedStore = create<PointsEarnedStore>((set) => ({
  lastPointsEarned: null,
  setLastPointsEarned: (points) => set({ lastPointsEarned: points }),
}))