import { create } from 'zustand';

interface SearchState {
  keyword: string;
  activeIndex: number;
  resultCount: number;

  setKeyword: (v: string) => void;
  setActiveIndex: (i: number) => void;
  setResultCount: (n: number) => void;
  setResultFromData: (data: unknown[] | null | undefined) => void;

  syncIndexWithResult: () => void;
  resetIndex: () => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  keyword: '',
  activeIndex: 1,
  resultCount: 0,

  setKeyword: (v) =>
    set(() => ({
      keyword: v,
      activeIndex: 1, //  검색어 바뀌면 인덱스 초기화
    })),

  // 실제 구현
  setResultFromData: (data) => {
    const count = data?.length ?? 0;
    const { activeIndex } = get();

    set({
      resultCount: count,
      activeIndex: count === 0 ? 0 : Math.min(Math.max(activeIndex, 1), count),
    });
  },

  syncIndexWithResult: () => {
    const { activeIndex, resultCount } = get();

    if (resultCount === 0) {
      set({ activeIndex: 0 });
      return;
    }

    if (activeIndex > resultCount) {
      set({ activeIndex: resultCount });
    }
  },

  setActiveIndex: (i) => set({ activeIndex: i }),
  setResultCount: (n) => set({ resultCount: n }),
  resetIndex: () => set({ activeIndex: 1 }),
  clear: () =>
    set({
      keyword: '',
      activeIndex: 1,
      resultCount: 0,
    }),
}));
