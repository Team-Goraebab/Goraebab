'use client';

import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sideBar';
import ZoomButtons from '../button/zoomButtons';
import PanButtons from '../button/panButtons';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isHandMode, setIsHandMode] = useState(false);

  return (
    <div className="relative flex h-screen bg-basic_1">
      <Header />
      <Sidebar />
      <div className="flex flex-col flex-1 ml-[300px] mt-[56px]">
        <div className="flex-1 overflow-y-auto bg-basic_1 p-4 bg-grey_0">
          <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
            {children}
          </main>
          <div className="flex flex-col">
            <ZoomButtons />
            <PanButtons setIsHandMode={setIsHandMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
