import { create } from 'zustand';

interface SelectedNetworkState {
  selectedNetwork: { hostId: string; networkName: string } | null;
  setSelectedNetwork: (hostId: string, networkName: string) => void;
  clearSelectedNetwork: () => void;
}

const useSelectedNetworkStore = create<SelectedNetworkState>((set) => ({
  selectedNetwork: null,
  setSelectedNetwork: (hostId: string, networkName: string) =>
    set({ selectedNetwork: { hostId, networkName } }),
  clearSelectedNetwork: () => set({ selectedNetwork: null }),
}));

export { useSelectedNetworkStore };
