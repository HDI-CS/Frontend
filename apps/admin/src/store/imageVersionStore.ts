import { create } from 'zustand';

interface ImageVersionStore {
  versions: Record<number, number>; // datasetId -> timestamp
  bump: (id: number) => void;
  get: (id: number) => number | undefined;
}

export const useImageVersionStore = create<ImageVersionStore>((set, get) => ({
  versions: {},
  bump: (id) =>
    set((state) => ({
      versions: { ...state.versions, [id]: Date.now() },
    })),
  get: (id) => get().versions[id],
}));
