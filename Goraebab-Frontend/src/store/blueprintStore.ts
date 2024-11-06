import { create } from 'zustand';
import { Host } from '@/types/type';

interface BlueprintStore {
  mappedData: any[];
  setMappedData: (data: any[]) => void;
}

export const useBlueprintStore = create<BlueprintStore>((set) => ({
  mappedData: [],
  setMappedData: (data) => set({ mappedData: data }),
}));
