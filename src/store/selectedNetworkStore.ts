import { create } from 'zustand';

interface SelectedNetworkState {
  selectedNetwork: {
    [x: string]: string;
    hostId: string;
    networkName: string;
    networkId: string;
  } | null;
  setSelectedNetwork: (
    hostId: string,
    networkName: string,
    networkId: string
  ) => void;
  clearSelectedNetwork: () => void;
}

// 선택한 네트워크를 저장하는 store
const useSelectedNetworkStore = create<SelectedNetworkState>((set) => ({
  selectedNetwork: null,
  setSelectedNetwork: (
    hostId: string,
    networkName: string,
    networkId: string
  ) => set({ selectedNetwork: { hostId, networkName, networkId } }),
  clearSelectedNetwork: () => set({ selectedNetwork: null }),
}));

export { useSelectedNetworkStore };
