import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface Container {
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

interface BridgeInfo {
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
}

export const selectedHostStore = create<SelectedHostStore>((set) => ({
  selectedHostId: null,
  selectedHostName: null,
  selectedHostIp: 'localhost',
  connectedBridgeIds: {},
  apiUrl: '',

  // 선택한 호스트 아이디
  setSelectedHostId: (id) =>
    set((state) => ({
      selectedHostId: id,
    })),

  // 선택한 호스트 이름
  setSelectedHostName: (name) =>
    set((state) => ({
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

      const bridgeWithuniqueId = { ...bridge, uniqueId: uuidv4() };

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
}));
