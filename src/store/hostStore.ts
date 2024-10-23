import { Host, HostNetwork } from '@/types/type';
import { create } from 'zustand';

interface HostStore {
  hosts: Host[];
  networks: HostNetwork[];
  addHost: (host: Host) => void;
  deleteHost: (hostId: string) => void;
  deleteNetwork: (
    hostId: string,
    networkName: string,
    networkId: string
  ) => void;
  deleteAllHosts: () => void;
}

// 호스트 및 네트워크 정보를 저장하는 store
// 상태 관리 로직
export const useHostStore = create<HostStore>((set, get) => ({
  hosts: [],
  networks: [],

  // 호스트 추가
  addHost: (host: Host) =>
    set((state) => {
      if (state.hosts.length >= 5) {
        return state;
      }

      return {
        hosts: [...state.hosts, { ...host, networks: [] }],
      };
    }),

  // 호스트 삭제
  deleteHost: (hostId) =>
    set((state) => ({
      hosts: state.hosts.filter((host) => host.id !== hostId),
      networks: state.networks.filter((network) => network.hostId !== hostId),
    })),

  // 네트워크 추가
  addNetworkToHost: (hostId: string, network: HostNetwork) =>
    set((state) => {
      const updatedHosts = state.hosts.map((host) => {
        if (host.id === hostId) {
          return {
            ...host,
            networks: [...host.networks, network],
          };
        }
        return host;
      });

      return {
        hosts: updatedHosts,
      };
    }),

  // 네트워크 삭제
  deleteNetwork: (hostId, networkName, networkId) =>
    set((state) => {
      const updatedHosts = state.hosts.map((host) => {
        if (host.id === hostId) {
          return {
            ...host,
            networks: host.networks.filter(
              (network) => network.id !== networkId
            ),
          };
        }
        return host;
      });

      return {
        hosts: updatedHosts,
      };
    }),

  // 모든 호스트 삭제
  deleteAllHosts: () =>
    set(() => ({
      hosts: [],
      networks: [],
    })),
}));
