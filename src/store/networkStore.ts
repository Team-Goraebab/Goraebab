import { create } from 'zustand';

interface Network {
  id: string;
  name: string;
  subnet: string;
  gateway: string;
  driver: string;
}

interface NetworkStore {
  networks: Network[];
  addNetwork: (network: Network) => void;
}

// 네트워크 정보를 저장하는 store
export const useNetworkStore = create<NetworkStore>((set) => ({
  networks: [],
  addNetwork: (network) =>
    set((state) => ({
      networks: [...state.networks, network],
    })),
}));
