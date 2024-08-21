import { create } from 'zustand';

interface Container {
  id: string;
  name?: string;
  ip?: string;
  active?: string;
}

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
