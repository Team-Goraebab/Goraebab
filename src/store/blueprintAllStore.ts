import { create } from 'zustand';

// 인터페이스 정의
interface ImageInfo {
  imageId: string;
  name: string;
  tag: string;
}

interface NetworkSettings {
  gateway: string;
  ipAddress: string;
}

interface PortMapping {
  privatePort: number;
  publicPort: number;
}

interface MountInfo {
  type: string;
  source: string;
  destination: string;
  name: string;
  driver: string;
  alias: string;
  mode: string;
}

export interface VolumeInfo {
  name: string;
  driver: string;
}

interface ContainerInfo {
  containerName: string;
  containerId: string;
  image: ImageInfo;
  networkSettings: NetworkSettings;
  ports: PortMapping[];
  mounts: MountInfo[];
  env: string[];
  cmd: string[];
}

export interface NetworkInfo {
  name: string;
  id: string;
  driver: string;
  ipam: { config: { subnet: string }[] };
  containers: ContainerInfo[];
}

interface HostInfo {
  name: string;
  id: string;
  isRemote: boolean;
  ip: string | null;
  themeColor: any;
  network: NetworkInfo[];
  volume: VolumeInfo[];
}

interface State {
  hosts: HostInfo[];
  clearHosts: () => void;
  setHosts: (newHosts: HostInfo[]) => void;
  addHost: (
    name: string,
    id: string,
    isRemote: boolean,
    ip: string | null,
    themeColor?: any
  ) => void;
  addNetworkToHost: (hostId: string, network: NetworkInfo) => void;
  addVolumeToHost: (hostId: string, volumes: VolumeInfo[]) => void;
  addContainerToNetwork: (
    hostId: string,
    networkId: string,
    containerId: string,
    containerName: string
  ) => void;
  updateContainer: (
    hostId: string,
    networkId: string,
    containerId: string,
    updatedContainer: Partial<ContainerInfo>
  ) => void;
  deleteHost: (hostId: string) => void;
  deleteNetworkFromHost: (hostId: string, networkId: string) => void;
  getJsonData: () => {
    blueprintId: number;
    name: string;
    data: { host: HostInfo[] };
  };
}

// Zustand 스토어 생성
export const useBlueprintAllStore = create<State>((set, get) => ({
  hosts: [],

  setHosts: (newHosts: HostInfo[]) => set({ hosts: newHosts }),

  // 호스트 전체 삭제
  clearHosts: () => set({ hosts: [] }),

  // 호스트 추가
  addHost: (name, id, isRemote, ip, themeColor) =>
    set((state) => ({
      hosts: [
        ...state.hosts,
        {
          name,
          id,
          isRemote,
          ip,
          network: [],
          volume: [],
          themeColor,
        },
      ],
    })),

  // 네트워크 추가
  addNetworkToHost: (hostId, network) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? { ...host, network: [...host.network, network] }
          : host
      ),
    })),

  // 호스트에 여러 볼륨 추가
  addVolumeToHost: (hostId, volumes) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? { ...host, volume: [...host.volume, ...volumes] }
          : host
      ),
    })),

  // 초기 컨테이너 추가
  addContainerToNetwork: (hostId, networkId, containerId, containerName) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? {
              ...host,
              network: host.network.map((network) =>
                network.id === networkId
                  ? {
                      ...network,
                      containers: [
                        ...network.containers,
                        {
                          containerId,
                          containerName,
                          image: { imageId: '', name: '', tag: '' },
                          networkSettings: { gateway: '', ipAddress: '' },
                          ports: [],
                          mounts: [],
                          env: [],
                          cmd: [],
                        },
                      ],
                    }
                  : network
              ),
            }
          : host
      ),
    })),

  // 컨테이너 업데이트
  updateContainer: (hostId, networkId, containerId, updatedContainer) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? {
              ...host,
              network: host.network.map((network) =>
                network.id === networkId
                  ? {
                      ...network,
                      containers: network.containers.map((container) =>
                        container.containerId === containerId
                          ? { ...container, ...updatedContainer }
                          : container
                      ),
                    }
                  : network
              ),
            }
          : host
      ),
    })),

  // 호스트 삭제
  deleteHost: (hostId) =>
    set((state) => ({
      hosts: state.hosts.filter((host) => host.id !== hostId),
    })),

  // 호스트에서 특정 네트워크 삭제
  deleteNetworkFromHost: (hostId, networkId) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? {
              ...host,
              network: host.network.filter(
                (network) => network.id !== networkId
              ),
            }
          : host
      ),
    })),

  // JSON 포맷으로 변환
  getJsonData: () => ({
    blueprintId: 1,
    name: 'Project1 blueprint',
    data: {
      host: get().hosts,
    },
  }),
}));
