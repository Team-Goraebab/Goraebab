import { create } from 'zustand';

interface Container {
  imageVolumes: any[];
  containerName: string;
  containerId: string;
  image: {
    imageId: string;
    name: string;
    tag: string;
  };
  networkSettings: {
    gateway: string;
    ipAddress: string;
  };
  ports: {
    privatePort: number;
    publicPort: number;
  }[];
  mounts: {
    type: string;
    name: string;
    source: string;
    destination: string;
    driver: string;
    alias: string;
    mode: string;
  }[];
  env: string[];
  cmd: string[];
}

interface Host {
  id: string;
  hostIp: string;
  containers: Container[];
}

interface Container {
  containerId: string;
}

interface ContainerStore {
  containers: { [containerId: string]: Container };
  succeededContainers: string[];
  setSucceededContainers: (containers: string[]) => void;
  addContainer: (container: Container) => void;
  getContainerById: (containerId: string) => Container | undefined;
  clearAllContainers: () => void;
  deleteContainerById: (containerId: string) => void;
  hosts: Host[];
  getHostIpByContainerId: (containerId: string) => string | undefined;
}

export const useContainerStore = create<ContainerStore>((set, get) => ({
  containers: {},
  hosts: [],

  // 컨테이너 추가
  addContainer: (container: Container) =>
    set((state) => ({
      containers: {
        ...state.containers,
        [container.containerId]: container,
      },
    })),

  // 특정 ID로 컨테이너 조회
  getContainerById: (containerId: string) => get().containers[containerId],

  // 전체 컨테이너 삭제
  clearAllContainers: () =>
    set(() => ({
      containers: {},
    })),

  // 특정 ID로 컨테이너 삭제
  deleteContainerById: (containerId: string) =>
    set((state) => {
      const updatedContainers = { ...state.containers };
      delete updatedContainers[containerId];
      return { containers: updatedContainers };
    }),

  // 특정 컨테이너 ID로 호스트 IP 조회
  getHostIpByContainerId: (containerId: string) => {
    const host = get().hosts.find((host) =>
      host.containers.some((container) => container.containerId === containerId)
    );
    return host ? host.hostIp : 'localhost';
  },

  // 성공한 컨테이너 목록
  succeededContainers: [],

  // 성공한 컨테이너 저장
  setSucceededContainers: (containers) =>
    set({ succeededContainers: containers }),
}));
