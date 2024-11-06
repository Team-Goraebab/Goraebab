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

interface NetworkInfo {
  name: string;
  id: string;
  driver: string;
  ipam: { config: { subnet: string }[] };
  containers: ContainerInfo[];
}

interface VolumeInfo {
  name: string;
  driver: string;
}

interface HostInfo {
  name: string;
  id: string;
  isRemote: boolean;
  ip: string | null;
  network: NetworkInfo[];
  volume: VolumeInfo[];
}

interface State {
  hosts: HostInfo[];
  addHost: (
    name: string,
    id: string,
    isRemote: boolean,
    ip: string | null
  ) => void;
  addNetworkToHost: (hostId: string, network: NetworkInfo) => void;
  addVolumeToHost: (hostId: string, volume: VolumeInfo) => void;
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
  getJsonData: () => {
    blueprintId: number;
    name: string;
    data: { host: HostInfo[] };
  };
}

// Zustand 스토어 생성
export const useBlueprintAllStore = create<State>((set, get) => ({
  hosts: [],

  // 호스트 추가
  addHost: (name, id, isRemote, ip) =>
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

  // 볼륨 추가
  addVolumeToHost: (hostId, volume) =>
    set((state) => ({
      hosts: state.hosts.map((host) =>
        host.id === hostId
          ? { ...host, volume: [...host.volume, volume] }
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

  // JSON 포맷으로 변환
  getJsonData: () => ({
    blueprintId: 1,
    name: 'Project1 blueprint',
    data: {
      host: get().hosts,
    },
  }),
}));
