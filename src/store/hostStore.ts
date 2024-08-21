import { create } from 'zustand';

type ThemeColor = {
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

export type Host = {
  id: string;
  hostNm: string;
  ip: string;
  isRemote: boolean;
  themeColor: ThemeColor;
  networkName: string;
  networkIp: string;
  className?: string;
};

type Network = {
  id: string;
  name: string;
  ip: string;
  hostId: string;
  containers: string[];
};

interface HostStore {
  hosts: Host[];
  networks: Network[];
  addHost: (host: Host) => void;
  deleteHost: (hostId: string) => void;
  deleteNetwork: (hostId: string, networkId: string) => void;
}

export const useHostStore = create<HostStore>((set) => ({
  hosts: [],
  networks: [],

  // 호스트 추가
  addHost: (host) =>
    set((state) => ({
      hosts: [...state.hosts, host],
    })),

  // 호스트 삭제
  deleteHost: (hostId) =>
    set((state) => ({
      hosts: state.hosts.filter((host) => host.id !== hostId),
      networks: state.networks.filter((network) => network.hostId !== hostId),
    })),

  // 네트워크 삭제
  deleteNetwork: (hostId, networkId) =>
    set((state) => {
      // 업데이트된 네트워크 목록
      const updatedNetworks = state.networks.filter(
        (network) => network.id !== networkId || network.hostId !== hostId
      );

      // 호스트를 업데이트하고 네트워크 정보를 제거
      const updatedHosts = state.hosts.map((host) => {
        if (host.id === hostId) {
          return {
            ...host,
            networkName: host.networkName === networkId ? '' : host.networkName,
            networkIp: host.networkIp === networkId ? '' : host.networkIp,
          };
        }
        return host;
      });

      return {
        networks: updatedNetworks,
        hosts: updatedHosts,
      };
    }),
}));
