'use client';

import React, { useState } from 'react';
import DarkModeButton from '@/components/button/darkModeButton';
import { MANAGEMENT_MENU } from '@/data/menu';
import General from '@/components/page/general';
import Resources from '@/components/page/resources';
import Engine from '@/components/page/engine';
import Builders from '@/components/page/builders';
import Notifications from '@/components/page/notifications';
import ManagementSidebar from '@/components/layout/managementSidebar';

const componentMap: Record<string, React.ElementType> = {
  General,
  Resources,
  Engine,
  Builders,
  Notifications,
};

const ManagementPage = () => {
  const [activeMenu, setActiveMenu] = useState<number>(1);

  const activeComponentName = MANAGEMENT_MENU.find(
    (item) => item.id === activeMenu
  )?.component;

  const ActiveComponent = activeComponentName
    ? componentMap[activeComponentName]
    : null;

  return (
    <div className="flex h-screen bg-grey_0 text-black_7 dark:bg-black_4 dark:text-grey_0">
      <ManagementSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <div className="flex-1 bg-grey_0 p-8 dark:bg-black_5 pt-20">
        {activeComponentName && ActiveComponent ? (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {MANAGEMENT_MENU.find((item) => item.id === activeMenu)?.label}
            </h2>
            <ActiveComponent />
          </>
        ) : (
          <p>No settings available for this menu.</p>
        )}
      </div>
      <DarkModeButton />
    </div>
  );
};

export default ManagementPage;
