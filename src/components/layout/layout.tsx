'use client';

import React from 'react';
import Header from './header';
import Sidebar from './sideBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen bg-basic_1">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="flex-1 overflow-y-auto bg-basic_1 mt-14 p-4  ml-[300px]">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
