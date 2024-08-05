'use client';

import React from 'react';
import { CardContainer, ConnectBar, HostCard } from '@/components';

type Container = {
  name: string;
  ip: string;
  status: 'running' | 'stopped';
};

type Network = {
  networkIp: string;
  containers: Container[];
};

type Host = {
  hostNm?: string;
  ip: string;
  status?: boolean;
};

type CardProps = {
  host: Host;
  network: Network;
};

const ContainerPage = ({ host, network }: CardProps) => {
  return (
    <div className="flex space-x-0">
      <HostCard hostNm={host.hostNm} ip={host.ip} status={host.status} />
      <ConnectBar />
      <CardContainer
        networkIp={network.networkIp}
        containers={network.containers}
      />
    </div>
  );
};

export default ContainerPage;
