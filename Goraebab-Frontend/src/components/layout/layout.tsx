'use client';

import React, { useState, useEffect } from 'react';
import { Header, Sidebar } from '@/components';
import { SnackbarProvider } from 'notistack';
import { usePathname } from 'next/navigation';
import Splash from '@/components/splash/splash';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ActionTabs from '@/components/tab/actionTabs';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isHandMode, setIsHandMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isSimpleLayout =
    pathname.includes('management') || pathname.includes('dashboard');

  if (loading) {
    return <Splash />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <SnackbarProvider maxSnack={3}>
        <Header />
        <div className="relative flex h-screen bg-basic_1 overflow-hidden">
          {isSimpleLayout ? (
            <div className="flex flex-col flex-1">
              <div className="flex-1 bg-basic_1 bg-grey_0">
                <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
                  {children}
                </main>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 mr-[280px]">
              <div className="flex-1 bg-basic_1 bg-grey_0">
                <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
                  {children}
                </main>
                <Sidebar />
                <ActionTabs />
              </div>
            </div>
          )}
        </div>
      </SnackbarProvider>
    </DndProvider>
  );
};

export default Layout;
