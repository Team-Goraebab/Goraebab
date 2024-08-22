import { create } from 'zustand';

interface SelectedHostStore {
  selectedHostId: string | null;
  connectedBridgeIds: { [key: string]: { name: string; gateway: string }[] };
  setSelectedHostId: (id: string | null) => void;
  addConnectedBridgeId: (
    hostId: string,
    bridge: { name: string; gateway: string }
  ) => void;
  deleteConnectedBridgeId: (hostId: string, networkName: string) => void;
}

// 선택한 호스트를 저장하는 store
export const selectedHostStore = create<SelectedHostStore>((set) => ({
  selectedHostId: null,
  connectedBridgeIds: {},

  // 선택한 호스트 아이디
  setSelectedHostId: (id) =>
    set((state) => ({
      selectedHostId: id,
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
