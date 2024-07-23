'use client';

import React from 'react';
import Header from './header';
import Sidebar from './sideBar';
import ZoomButtons from '../button/zoomButtons';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen bg-basic_1">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <Header />
        <div className="flex-1 overflow-y-auto bg-basic_1 mt-14 p-4 ml-[300px] relative">
          <main className="relative">{children}</main>
          <ZoomButtons />
        </div>
      </div>
    </div>
  );
};

export default Layout;
