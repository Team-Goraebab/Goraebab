import { create } from 'zustand';
import { Host } from '@/types/type';

interface BlueprintStore {
  mappedData: Host[];
  setMappedData: (data: Host[]) => void;
}

export const useBlueprintStore = create<BlueprintStore>((set) => ({
  mappedData: [],

  setMappedData: (data) => set({ mappedData: data }),
}));
