import { create } from 'zustand';

interface SearchStore {
  query: string;
  setQuery: (q: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
}));
