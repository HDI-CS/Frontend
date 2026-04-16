import { create } from 'zustand';

interface SubHeaderState {
  extraLabel?: string;
  setExtraLabel: (label?: string) => void;
  clearExtraLabel: () => void;
}

export const useSubHeaderStore = create<SubHeaderState>((set) => ({
  extraLabel: undefined,
  setExtraLabel: (label) => set({ extraLabel: label }),
  clearExtraLabel: () => set({ extraLabel: undefined }),
}));
