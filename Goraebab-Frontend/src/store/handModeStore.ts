import { create } from 'zustand';

interface HandModeState {
  isHandMode: boolean;
  setHandMode: (isHandMode: boolean) => void;
}

// 사용자의 커서 상태를 저장하는 store
export const useHandModeStore = create<HandModeState>((set) => ({
  isHandMode: false,
  setHandMode: (isHandMode) => set({ isHandMode }),
}));
