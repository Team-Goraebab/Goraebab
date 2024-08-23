'use client';

import React from 'react';
import CardSection from '@/components/card/cardSection';
import { TransformProvider } from '@/context/useTransformContext';
import useHandModeSubscription from '@/hook/useHandModeSubscription';
import { useHostStore } from '@/store/hostStore';

const ContainerPage = () => {
  const [isHandMode, setIsHandMode] = React.useState(false);

  // hosts 데이터
  const hosts = useHostStore((state) => state.hosts);

  useHandModeSubscription((newIsHandMode) => {
    setIsHandMode(newIsHandMode);
  });

  return (
    <TransformProvider>
      {hosts.length > 0 &&
        hosts.map((host, index) => (
          <CardSection key={index} hostData={[host]} isHandMode={isHandMode} />
        ))}
    </TransformProvider>
  );
};

export default ContainerPage;
