import { create } from 'zustand';

interface Image {
  id: string;
  name: string;
  tags: string;
  source: 'local' | 'dockerHub';
  size: string;
}

interface ImageStore {
  images: Image[];
  addImage: (image: Image) => void;
}

// 이미지 정보를 저장하는 store
export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  addImage: (image) =>
    set((state) => ({
      images: [...state.images, image],
    })),
}));
