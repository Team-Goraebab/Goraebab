'use client';

import React from 'react';
import CardSection from '@/components/card/cardSection';
import { TransformProvider } from '@/context/useTransformContext';
import useHandModeSubscription from '@/hook/useHandModeSubscription';
import { useBlueprintAllStore } from '@/store/blueprintAllStore';

const Main = () => {
  const [isHandMode, setIsHandMode] = React.useState(false);

  // useBlueprintAllStore에서 hosts 데이터를 가져옵니다.
  const hosts = useBlueprintAllStore((state) => state.hosts);

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
                hostNm: host.name,
                hostIp: host.ip ?? 'localhost',
                themeColor: host.themeColor,
              },
            ]}
            isHandMode={isHandMode}
          />
        ))}
    </TransformProvider>
  );
};

export default Main;
