'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import { MENU_ITEMS } from '@/data/menu';
import { useMenuStore } from '@/store/menuStore';
import { FiSettings, FiGrid } from 'react-icons/fi';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const { activeId, setActiveId } = useMenuStore();
  const [barWidth, setBarWidth] = useState(0);
  const [barLeft, setBarLeft] = useState(0);

  const isRightSidePath = pathname === '/setting' || pathname === '/dashboard';

  useEffect(() => {
    if (navRef.current && !isRightSidePath) {
      const activeIndex = MENU_ITEMS.findIndex((item) => item.id === activeId);
      const activeItem = navRef.current.children[activeIndex];
      if (activeItem) {
        setBarWidth(activeItem.clientWidth);
        setBarLeft(
          activeItem.getBoundingClientRect().left -
            navRef.current.getBoundingClientRect().left
        );
      }
    }
  }, [activeId, isRightSidePath]);

  const handleNavigation = (path: string, id: number) => {
    setActiveId(id);
    router.push(path);
  };

  return (
    <header className="fixed w-full p-4 bg-grey_1 z-30">
      <div className="container mx-auto flex justify-between items-center relative">
        <div className="flex-grow" />
        <nav
          className="flex space-x-6 relative items-center justify-center"
          ref={navRef}
        >
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`flex flex-col items-center cursor-pointer font-pretendard ${
                activeId === item.id && !isRightSidePath
                  ? 'text-blue_6'
                  : 'text-grey_6'
              }`}
              data-tooltip-id={`tooltip-${item.name}`}
              data-tooltip-content={item.name}
            >
              <item.icon className="text-2xl" />
              <Tooltip id={`tooltip-${item.name}`} />
            </div>
          ))}
          {!isRightSidePath && (
            <div
              className="absolute bottom-0 h-1 bg-blue_6 rounded-tl rounded-tr transition-all duration-300"
              style={{
                width: `${barWidth}px`,
                left: `${barLeft - 24}px`,
                top: 37,
              }}
            />
          )}
        </nav>
        <div className="flex-grow" />
        <div className="flex items-center space-x-4">
          <div
            onClick={() => handleNavigation('/dashboard', 5)}
            className={`cursor-pointer text-grey_6 hover:text-blue_6 transition-colors ${
              pathname === '/dashboard' ? 'text-blue_6' : ''
            }`}
          >
            <FiGrid className="text-2xl" data-tooltip-id="dashboard-tooltip" />
            <Tooltip id="dashboard-tooltip" content="Dashboard" />
          </div>

          <div
            onClick={() => handleNavigation('/setting', 6)}
            className={`cursor-pointer text-grey_6 hover:text-blue_6 transition-colors ${
              pathname === '/setting' ? 'text-blue_6' : ''
            }`}
          >
            <FiSettings
              className="text-2xl"
              data-tooltip-id="setting-tooltip"
            />
            <Tooltip id="setting-tooltip" content="Setting" />
          </div>
        </div>

        {isRightSidePath && (
          <div
            className="absolute bottom-0 h-1 bg-blue_6 rounded-tl rounded-tr transition-all duration-300"
            style={{
              width: `${barWidth}px`,
              right: pathname === '/setting' ? '23px' : '64px',
              top: 37,
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
