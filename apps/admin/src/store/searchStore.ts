import { create } from 'zustand';

interface SearchState {
  keyword: string;
  activeIndex: number;
  resultCount: number;

  setKeyword: (v: string) => void;
  setActiveIndex: (i: number) => void;
  setResultCount: (n: number) => void;
  resetIndex: () => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  activeIndex: 1,
  resultCount: 0,

  setKeyword: (v) =>
    set(() => ({
      keyword: v,
      activeIndex: 1, //  검색어 바뀌면 인덱스 초기화
    })),
  setActiveIndex: (i) => set({ activeIndex: i }),
  setResultCount: (n) => set({ resultCount: n }),
  resetIndex: () => set({ activeIndex: 1 }),
  clear: () => set({ keyword: '' }),
}));
