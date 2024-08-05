import React from 'react';
import ImagePage from './(image)/image/page';
import ContainerPage from './(container)/container/page';
import { HOST_DATA, NETWORK_DATA } from '@/data/mock';

type Container = {
  name: string;
  ip: string;
  status: 'running' | 'stopped';
};

export type Network = {
  networkIp: string;
  containers: Container[];
};

export default function Page() {
  return (
    <div>
      <ImagePage />
      <ContainerPage host={HOST_DATA} network={NETWORK_DATA} />
    </div>
  );
}
