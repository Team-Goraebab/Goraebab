'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiBox,
  FiSettings,
} from 'react-icons/fi';
import ManagementCard from '../card/managementCard';

const General = () => {
  const [versionInfo, setVersionInfo] = useState<any>();
  const [systemInfo, setSystemInfo] = useState<any>();

  useEffect(() => {
    fetchVersionInfo();
    fetchSystemInfo();
  }, []);

  async function fetchVersionInfo() {
    try {
      const response = await axios.get(`/api/daemon/version`);
      setVersionInfo(response.data);
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
    }
  }

  async function fetchSystemInfo() {
    try {
      const response = await axios.get(`/api/daemon/system`);
      setSystemInfo(response.data);
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
    }
  }

  const cardData = [
    {
      icon: FiBox,
      title: 'Docker Version',
      data: [
        { label: 'Version', value: versionInfo?.Version },
        { label: 'API Version', value: versionInfo?.ApiVersion },
      ],
    },
    {
      icon: FiCpu,
      title: 'CPU Information',
      data: [{ label: 'CPU', value: `${systemInfo?.NCPU} cores` }],
    },
    {
      icon: FiHardDrive,
      title: 'Memory Information',
      data: [
        {
          label: 'Total Memory',
          value: `${Math.round(
            systemInfo?.MemTotal / (1024 * 1024 * 1024)
          )} GB`,
        },
      ],
    },
    {
      icon: FiDatabase,
      title: 'Containers & Images',
      data: [
        { label: 'Running Containers', value: systemInfo?.ContainersRunning },
        { label: 'Total Images', value: systemInfo?.Images },
      ],
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <FiSettings className="text-blue_4" />
        <span>General Information</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map(
          (item, index) =>
            item.data[0].value && (
              <ManagementCard
                key={index}
                icon={item.icon}
                title={item.title}
                cardData={item.data}
              />
            )
        )}
      </div>
    </>
  );
};

export default General;
