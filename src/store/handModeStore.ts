import { create } from 'zustand';

interface HandModeState {
  isHandMode: boolean;
  setHandMode: (isHandMode: boolean) => void;
}

export const useHandModeStore = create<HandModeState>((set) => ({
  isHandMode: false,
  setHandMode: (isHandMode) => set({ isHandMode }),
}));
