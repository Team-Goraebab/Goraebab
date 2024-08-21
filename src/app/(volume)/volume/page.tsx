'use client';

import ContainersManagement from '@/components/docker/containersManagement';
import DBManagement from '@/components/docker/dbManagement';
import DockerManagement from '@/components/docker/dockerManagement';
import HarborManagement from '@/components/docker/harborManagement';

const VolumePage = () => {
  return (
    <>
      <h1>Management Dashboard</h1>
      <DockerManagement />
      <DBManagement />
      <HarborManagement />
      <ContainersManagement />
    </>
  );
};

export default VolumePage;
