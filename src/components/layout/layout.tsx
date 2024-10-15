'use client';

import React, { useState } from 'react';
import { PanButtons, Sidebar } from '@/components';
import AddHostButton from '../button/addHostButton';
import SaveButton from '../button/saveButton';
import DeleteBlueprintButton from '../button/deleteBlueprintButton';
import { SnackbarProvider } from 'notistack';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isHandMode, setIsHandMode] = useState(false);

  const isSimpleLayout =
    pathname.includes('management') || pathname.includes('dashboard');

  return (
    <SnackbarProvider maxSnack={3}>
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
          <div className="flex flex-col flex-1 ml-[300px]">
            <div className="flex-1 bg-basic_1 bg-grey_0">
              <main className={`relative ${isHandMode ? 'hand-mode' : ''}`}>
                {children}
              </main>
              <Sidebar progress={30} />
              <PanButtons />
              <AddHostButton />
              <DeleteBlueprintButton />
              <SaveButton />
            </div>
          </div>
        )}
      </div>
    </SnackbarProvider>
  );
};

export default Layout;
