import { create } from 'zustand';

interface ContainerNameStore {
  containerNames: { [key: string]: string };
  setContainerName: (
    hostId: string,
    networkId: string,
    containerId: string,
    name: string
  ) => void;
  getContainerName: (
    hostId: string,
    networkId: string,
    containerId: string
  ) => string | undefined;
}

export const useContainerNameStore = create<ContainerNameStore>((set, get) => ({
  containerNames: {},
  setContainerName: (hostId, networkId, containerId, name) => {
    const key = `${hostId}-${networkId}-${containerId}`;
    set((state) => ({
      containerNames: {
        ...state.containerNames,
        [key]: name,
      },
    }));
  },
  getContainerName: (hostId, networkId, containerId) => {
    const key = `${hostId}-${networkId}-${containerId}`;
    return get().containerNames[key];
  },
}));
