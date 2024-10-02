import { Container } from '@/types/type';
import { create } from 'zustand';

interface HostContainers {
  [hostId: string]: Container[];
}

interface StoreState {
  hostContainers: HostContainers;
  addContainerToHost: (hostId: string, container: Container) => void;
}

export const useStore = create<StoreState>((set) => ({
  hostContainers: {},
  addContainerToHost: (hostId: string, container: Container) =>
    set((state) => ({
      hostContainers: {
        ...state.hostContainers,
        [hostId]: [...(state.hostContainers[hostId] || []), container],
      },
    })),
}));
