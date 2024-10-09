'use client';

import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import SettingSidebar from '@/components/layout/settingSidebar';
import DarkModeButton from '@/components/button/darkModeButton';

const SettingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number>(1);

  return (
    <div className="flex h-screen bg-grey_0 text-black_7 dark:bg-black_4 dark:text-grey_0">
      <SettingSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* 설정 내용 */}
      <div className="flex-1 bg-grey_0 p-8 dark:bg-black_5 pt-20">
        {activeMenu === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">General</h2>
            <div className="flex flex-col space-y-4">
              <input type="checkbox" className="form-checkbox h-5 w-5" />
            </div>
          </div>
        )}
        {activeMenu === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
          </div>
        )}
        {activeMenu === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Docker Engine</h2>
          </div>
        )}
      </div>
      <DarkModeButton />
    </div>
  );
};

export default SettingPage;
