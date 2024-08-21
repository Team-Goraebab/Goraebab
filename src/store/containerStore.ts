import { create } from 'zustand';

interface Container {
  id: string;
  name: string;
  ip: string;
  size: string;
  tags: string;
  active: string;
  status: string;
  imageId?: string; // 연결된 이미지 ID
  volumeId?: string; // 연결된 볼륨 ID
  networkId?: string; // 연결된 네트워크 ID
}

interface ContainerStore {
  containers: Container[];
  addContainer: (container: Container) => void;
  assignImageToContainer: (containerId: string, imageId: string) => void;
  assignVolumeToContainer: (containerId: string, volumeId: string) => void;
  assignNetworkToContainer: (containerId: string, networkId: string) => void;
}

export const useContainerStore = create<ContainerStore>((set) => ({
  containers: [],
  addContainer: (container) =>
    set((state) => ({
      containers: [...state.containers, container],
    })),
  assignImageToContainer: (containerId, imageId) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, imageId } : container
      ),
    })),
  assignVolumeToContainer: (containerId, volumeId) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, volumeId } : container
      ),
    })),
  assignNetworkToContainer: (containerId, networkId) =>
    set((state) => ({
      containers: state.containers.map((container) =>
        container.id === containerId ? { ...container, networkId } : container
      ),
    })),
}));
