import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuState {
  activeId: number;
  setActiveId: (id: number) => void;
}

// 메뉴 클릭 시 아이디 값으로 저장
export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      activeId: 1,
      setActiveId: (id: number) => set({ activeId: id }),
    }),
    {
      name: 'menu-storage', // localStorage에 저장될 키 이름
    }
  )
);
