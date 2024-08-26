'use client';

import React, { useEffect } from 'react';
import CardSection from '@/components/card/cardSection';
import { TransformProvider } from '@/context/useTransformContext';
import useHandModeSubscription from '@/hook/useHandModeSubscription';
import { useHostStore } from '@/store/hostStore';
import axios from 'axios';

const ContainerPage = () => {
  const [isHandMode, setIsHandMode] = React.useState(false);

  // hosts 데이터
  const hosts = useHostStore((state) => state.hosts);

  useHandModeSubscription((newIsHandMode) => {
    setIsHandMode(newIsHandMode);
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:2387/remote/daemons');
        console.log(response);
      } catch (error) {
        console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
      }
    }

    fetchData();
  }, []);

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
