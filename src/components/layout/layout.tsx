'use client';

import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sideBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative flex h-screen bg-basic_1">
      <div className="flex flex-col flex-1">
        <Header />
        <Sidebar />
        {/* <div className="flex-1 overflow-y-auto bg-basic_1 mt-14"> */}
        <div className="">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
