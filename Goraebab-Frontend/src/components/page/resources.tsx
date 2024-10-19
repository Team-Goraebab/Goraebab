'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCpu, FiHardDrive, FiDatabase } from 'react-icons/fi';
import ManagementCard from '../card/managementCard';
import { fetchData } from '@/services/apiUtils';
import ContainerTable from '../table/containerTable';

const Resources = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [containers, setContainers] = useState<any[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    ''
  );
  const [selectedContainerName, setSelectedContainerName] = useState<
    string | null
  >(null);
  const [containerStats, setContainerStats] = useState<any>(null);

  useEffect(() => {
    fetchSystemInfo();
    fetchContainers(); // 컨테이너 목록을 가져옴
  }, []);

  // Docker 시스템 정보 가져오기
  async function fetchSystemInfo() {
    try {
      const response = await axios.get(`/api/daemon/system`);
      setSystemInfo(response.data); // 시스템 정보 저장
    } catch (error) {
      console.error('원격 데몬 정보를 가져오는 데 실패했습니다:', error);
    }
  }

  // 컨테이너 목록 가져오기
  async function fetchContainers() {
    try {
      const response = await axios.get(`/api/container/list`); // 현재 실행 중인 컨테이너 목록 조회
      setContainers(response.data || []); // 컨테이너 목록 저장
    } catch (error) {
      console.error('컨테이너 목록을 가져오는 데 실패했습니다:', error);
    }
  }

  // 특정 컨테이너의 자원 사용량 조회
  const fetchContainerStats = async (id: string) => {
    try {
      const data = await fetchData(`/api/container/stats?id=${id}`);
      if (!data) {
        throw new Error('Failed to fetch container stats');
      }
      setContainerStats(data);
    } catch (error) {
      console.error('Error fetching container stats:', error);
      throw error;
    }
  };

  // 컨테이너 클릭 핸들러
  const handleContainerClick = (id: string, name: string) => {
    setSelectedContainerId(id); // 선택된 컨테이너 ID 설정
    setSelectedContainerName(name);
    fetchContainerStats(id); // 해당 컨테이너의 자원 사용량 가져오기
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2 sticky top-0 z-10">
        <FiCpu className="text-blue_4" /> <span>System Resources</span>
      </h2>

      {/* 컨테이너 목록 그리드 표시 */}
      <div className="max-h-64">
        <ContainerTable
          containers={containers}
          onContainerClick={handleContainerClick}
        />
      </div>

      {/* 선택된 컨테이너의 세부 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {containerStats && selectedContainerId && (
          <>
            <ManagementCard
              icon={FiCpu}
              title={`CPU Usage for Container`}
              cardData={[
                {
                  label: `Name`,
                  value: `${selectedContainerName}`,
                },
                {
                  label: 'Usage',
                  value: `${containerStats.cpu_stats.cpu_usage.total_usage} nano seconds`,
                },
              ]}
            />
            <ManagementCard
              icon={FiHardDrive}
              title="Memory Usage"
              cardData={[
                {
                  label: 'Usage',
                  value: `${Math.round(
                    (containerStats.memory_stats?.usage || 0) / (1024 * 1024)
                  )} MB`,
                },
                {
                  label: 'Limit',
                  value: `${Math.round(
                    (containerStats.memory_stats?.limit || 0) / (1024 * 1024)
                  )} MB`,
                },
              ]}
            />
            <ManagementCard
              icon={FiDatabase}
              title="Disk Information"
              cardData={[
                { label: 'Total Images', value: systemInfo?.Images },
                {
                  label: 'Running Containers',
                  value: systemInfo?.ContainersRunning,
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;
