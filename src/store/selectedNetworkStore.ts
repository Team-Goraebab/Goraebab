import { create } from 'zustand';

interface SelectedNetworkState {
  selectedNetwork: {
    hostId: string;
    networkName: string;
    networkId: string;
    uniqueId: string;
  } | null;
  setSelectedNetwork: (
    hostId: string,
    networkName: string,
    networkId: string,
    uniqueId: string
  ) => void;
  clearSelectedNetwork: () => void;
}

// 선택한 네트워크를 저장하는 store
const useSelectedNetworkStore = create<SelectedNetworkState>((set) => ({
  selectedNetwork: null,
  setSelectedNetwork: (
    hostId: string,
    networkName: string,
    networkId: string,
    uniqueId: string
  ) => set({ selectedNetwork: { hostId, networkName, networkId, uniqueId } }),
  clearSelectedNetwork: () => set({ selectedNetwork: null }),
}));

export { useSelectedNetworkStore };
