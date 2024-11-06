import { generateId } from '@/utils/randomId';
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

export interface BridgeInfo {
  id: string;
  uniqueId: string;
  name: string;
  gateway: string;
  driver: string;
  subnet: string;
  scope: string;
  containers: Container[];
}

interface SelectedHostStore {
  selectedHostId: string | null;
  selectedHostName: string | null;
  selectedHostIp: string;
  connectedBridgeIds: { [key: string]: BridgeInfo[] };
  apiUrl: string;
  setSelectedHostId: (id: string | null) => void;
  setSelectedHostName: (name: string | null) => void;
  setSelectedHostIp: (ip: string | null) => void;
  setApiUrl: (url: string) => void;
  addConnectedBridgeId: (hostId: string, bridge: BridgeInfo) => void;
  deleteConnectedBridgeId: (hostId: string, uniqueId: string) => void;
  clearConnectedBridges: () => void;
  clearBridgesForHost: (hostId: string) => void;
  updateContainerName: (
    hostId: string,
    containerId: string,
    newName: string
  ) => void;
}

export const selectedHostStore = create<SelectedHostStore>((set) => ({
  selectedHostId: null,
  selectedHostName: null,
  selectedHostIp: 'localhost',
  connectedBridgeIds: {},
  apiUrl: '',

  // 선택한 호스트 아이디
  setSelectedHostId: (id) =>
    set(() => ({
      selectedHostId: id,
    })),

  // 선택한 호스트 이름
  setSelectedHostName: (name) =>
    set(() => ({
      selectedHostName: name,
    })),

  // 선택한 호스트 아이피
  setSelectedHostIp: (ip) =>
    set(() => ({
      selectedHostIp: ip || 'localhost',
    })),

  // API Url 변경
  setApiUrl: (url) =>
    set(() => ({
      apiUrl: url,
    })),

  // 브릿지 연결
  addConnectedBridgeId: (hostId, bridge) =>
    set((state) => {
      const currentBridges = state.connectedBridgeIds[hostId] || [];
      if (currentBridges.length >= 3) {
        return state;
      }
      const networkId = generateId('network');
      const bridgeWithuniqueId = { ...bridge, uniqueId: networkId };

      return {
        connectedBridgeIds: {
          ...state.connectedBridgeIds,
          [hostId]: [...currentBridges, bridgeWithuniqueId],
        },
      };
    }),

  // 연결된 브릿지 삭제
  deleteConnectedBridgeId: (hostId, uniqueId) =>
    set((state) => {
      const updatedBridges = (state.connectedBridgeIds[hostId] || []).filter(
        (bridge) => bridge.uniqueId !== uniqueId
      );
      return {
        connectedBridgeIds: {
          ...state.connectedBridgeIds,
          [hostId]: updatedBridges,
        },
      };
    }),

  // 모든 연결된 브릿지 삭제
  clearConnectedBridges: () =>
    set(() => ({
      connectedBridgeIds: {},
    })),

  // 특정 호스트 ID에 연결된 모든 브릿지 삭제
  clearBridgesForHost: (hostId) =>
    set((state) => {
      const updatedConnectedBridgeIds = { ...state.connectedBridgeIds };
      delete updatedConnectedBridgeIds[hostId];
      return {
        connectedBridgeIds: updatedConnectedBridgeIds,
      };
    }),

  // 컨테이너 이름 업데이트
  updateContainerName: (hostId: string, containerId: string, name: string) =>
    set((state) => {
      const updatedBridges = state.connectedBridgeIds[hostId]?.map(
        (bridge) => ({
          ...bridge,
          containers: bridge.containers.map((container) =>
            container.containerId === containerId
              ? { ...container, containerName: name }
              : container
          ),
        })
      );
      return {
        connectedBridgeIds: {
          ...state.connectedBridgeIds,
          [hostId]: updatedBridges,
        },
      };
    }),
}));
