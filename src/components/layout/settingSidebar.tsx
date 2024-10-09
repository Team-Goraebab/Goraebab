'use client';

import { SETTINGS_MENU } from '@/data/menu';

interface SettingSidebarProps {
  activeMenu: number;
  setActiveMenu: (id: number) => void;
}

const SettingSidebar = ({ activeMenu, setActiveMenu }: SettingSidebarProps) => {
  return (
    <>
      <div className="w-[300px] bg-white dark:bg-black_6 border-r-2 border-grey_2 dark:border-black_4">
        <div className="flex flex-col flex-grow pl-4 pr-4 pt-20 overflow-y-auto scrollbar-hide">
          <h2 className="text-lg font-semibold mb-4 dark:text-black_0">
            Settings
          </h2>
          <ul>
            {SETTINGS_MENU.map((item) => (
              <li
                key={item.id}
                className={`flex items-center space-x-2 py-2 px-3 cursor-pointer rounded-md transition-colors mb-2 ${
                  activeMenu === item.id
                    ? 'bg-grey_1 text-blue_5 dark:bg-black_5 dark:text-blue_3'
                    : 'hover:bg-grey_1 dark:hover:bg-black_5'
                }`}
                onClick={() => setActiveMenu(item.id)}
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SettingSidebar;
