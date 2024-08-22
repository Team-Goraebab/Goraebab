import { create } from 'zustand';

interface Volume {
  id: string;
  name: string;
  driver: string;
  mountPoint: string;
  capacity: string;
  status?: string;
}

interface VolumeStore {
  volumes: Volume[];
  addVolume: (volume: Volume) => void;
}

// 볼륨 정보를 저장하는 stores
export const useVolumeStore = create<VolumeStore>((set) => ({
  volumes: [],
  addVolume: (volume) =>
    set((state) => ({
      volumes: [...state.volumes, volume],
    })),
}));
