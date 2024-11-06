import { create } from 'zustand';

interface RefreshStore {
  refresh: boolean;
  setRefresh: () => void;
}

export const useRefreshStore = create<RefreshStore>((set) => ({
  refresh: false,
  setRefresh: () => set((state) => ({ refresh: !state.refresh })),
}));
