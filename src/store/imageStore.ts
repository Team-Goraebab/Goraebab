import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Image {
  id: string;
  name: string;
  tags: string;
  source: 'local' | 'dockerHub';
  size: string;
  status: string;
}

interface ImageStore {
  images: Image[];
  addImage: (image: Image) => void;
  removeImage: (id: string) => void;
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set) => ({
      images: [],
      addImage: (image) =>
        set((state) => ({
          images: [...state.images, image],
        })),
      removeImage: (id) =>
        set((state) => ({
          images: state.images.filter((image) => image.id !== id),
        })),
    }),
    {
      name: 'image-storage', // 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 기본값은 localStorage입니다
    }
  )
);
