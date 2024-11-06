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
  deleteContainerName: (
    hostId: string,
    networkId: string,
    containerId: string
  ) => void;
  clearAllContainerNames: () => void;
}

export const useContainerNameStore = create<ContainerNameStore>((set, get) => ({
  containerNames: {},

  // 컨테이너 이름 저장
  setContainerName: (hostId, networkId, containerId, name) => {
    const key = `${hostId}-${networkId}-${containerId}`;
    set((state) => ({
      containerNames: {
        ...state.containerNames,
        [key]: name,
      },
    }));
  },

  // 컨테이너 이름 조회
  getContainerName: (hostId, networkId, containerId) => {
    const key = `${hostId}-${networkId}-${containerId}`;
    return get().containerNames[key];
  },

  // 특정 컨테이너 이름 삭제
  deleteContainerName: (hostId, networkId, containerId) => {
    const key = `${hostId}-${networkId}-${containerId}`;
    set((state) => {
      const newContainerNames = { ...state.containerNames };
      delete newContainerNames[key];
      return { containerNames: newContainerNames };
    });
  },

  // 전체 컨테이너 이름 삭제
  clearAllContainerNames: () => {
    set(() => ({
      containerNames: {},
    }));
  },
}));
