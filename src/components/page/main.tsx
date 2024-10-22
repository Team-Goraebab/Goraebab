'use client';

import React, { useEffect } from 'react';
import CardSection from '@/components/card/cardSection';
import { TransformProvider } from '@/context/useTransformContext';
import useHandModeSubscription from '@/hook/useHandModeSubscription';
import { useHostStore } from '@/store/hostStore';

const Main = () => {
  const [isHandMode, setIsHandMode] = React.useState(false);

  const hosts = useHostStore((state) => state.hosts);
  useEffect(() => {
    console.log('host data >>>>>', hosts);
  }, [hosts]);

  useHandModeSubscription((newIsHandMode) => {
    setIsHandMode(newIsHandMode);
  });

  return (
    <TransformProvider>
      {hosts.length > 0 &&
        hosts.map((host, index) => (
          <CardSection
            key={index}
            hostData={[
              {
                ...host,
                hostIp: host.hostIp ?? 'localhost',
              },
            ]}
            isHandMode={isHandMode}
          />
        ))}
    </TransformProvider>
  );
};

export default Main;
