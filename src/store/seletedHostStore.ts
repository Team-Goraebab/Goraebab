import { create } from 'zustand';

interface BridgeInfo {
  name: string;
  gateway: string;
  driver: string;
  subnet: string;
  scope: string;
}

interface SelectedHostStore {
  selectedHostId: string | null;
  selectedHostName: string | null;
  selectedHostIp: string | null;
  connectedBridgeIds: { [key: string]: BridgeInfo[] };
  apiUrl: string;
  setSelectedHostId: (id: string | null) => void;
  setSelectedHostName: (name: string | null) => void;
  setSelectedHostIp: (ip: string | null) => void;
  setApiUrl: (url: string) => void;
  addConnectedBridgeId: (hostId: string, bridge: BridgeInfo) => void;
  deleteConnectedBridgeId: (hostId: string, networkName: string) => void;
}

export const selectedHostStore = create<SelectedHostStore>((set) => ({
  selectedHostId: null,
  selectedHostName: null,
  selectedHostIp: null,
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
    set((state) => ({
      selectedHostIp: ip,
    })),

  // API Url 변경
  setApiUrl: (url) =>
    set(() => ({
      apiUrl: url,
    })),

  // 브릿지 연결
  addConnectedBridgeId: (hostId, bridge) =>
    set((state) => ({
      connectedBridgeIds: {
        ...state.connectedBridgeIds,
        [hostId]: [...(state.connectedBridgeIds[hostId] || []), bridge],
      },
    })),

  // 연결된 브릿지 삭제
  deleteConnectedBridgeId: (hostId, networkName) =>
    set((state) => {
      const updatedBridges = (state.connectedBridgeIds[hostId] || []).filter(
        (bridge) => bridge.name !== networkName
      );
      return {
        connectedBridgeIds: {
          ...state.connectedBridgeIds,
          [hostId]: updatedBridges,
        },
      };
    }),
}));
