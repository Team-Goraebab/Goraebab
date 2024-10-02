import { create } from 'zustand';
import { Network } from '@/types/type';

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
