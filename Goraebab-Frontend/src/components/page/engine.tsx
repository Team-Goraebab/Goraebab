'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiGrid, FiTrash2 } from 'react-icons/fi';
import Modal from '../modal/modal';
import ManagementCard from '../card/managementCard';

const Engine = () => {
  const [engineInfo, setEngineInfo] = useState<any>(null);
  const [diskUsage, setDiskUsage] = useState<any>(null);
  const [isPruning, setIsPruning] = useState<boolean>(false);
  const [pruneResult, setPruneResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchEngineInfo();
    fetchDiskUsage();
  }, []);

  // Fetch Docker Engine Info
  const fetchEngineInfo = async () => {
    try {
      const response = await axios.get('/api/daemon/system');
      setEngineInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch engine info:', error);
      setEngineInfo({});
    }
  };

  // Fetch Docker Disk Usage
  const fetchDiskUsage = async () => {
    try {
      const response = await axios.get('/api/daemon/system/df');
      setDiskUsage(response.data);
    } catch (error) {
      console.error('Failed to fetch disk usage:', error);
      setDiskUsage({});
    }
  };

  const handlePrune = async () => {
    setIsPruning(true);
    try {
      const response = await axios.post('/api/daemon/system/prune');
      setPruneResult(response.data);
    } catch (error) {
      console.error('Failed to prune resources:', error);
    } finally {
      setIsPruning(false);
      setIsModalOpen(false);
      fetchDiskUsage();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2 sticky top-0 z-10">
        <FiGrid className="text-blue_4" /> <span>Docker Engine Overview</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Engine Info */}
        {engineInfo && (
          <ManagementCard
            icon={FiTrash2}
            title="Engine Info"
            cardData={[
              {
                label: 'Server Version',
                value: engineInfo.ServerVersion || 'N/A',
              },
              { label: 'OS', value: engineInfo.OperatingSystem || 'N/A' },
              { label: 'Containers', value: engineInfo.Containers || 0 },
              {
                label: 'Running Containers',
                value: engineInfo.ContainersRunning || 0,
              },
              { label: 'Images', value: engineInfo.Images || 0 },
              {
                label: 'Memory',
                value: engineInfo.MemTotal
                  ? `${Math.round(
                      engineInfo.MemTotal / (1024 * 1024 * 1024)
                    )} GB`
                  : 'N/A',
              },
            ]}
          />
        )}

        {/* Disk Usage Info */}
        {diskUsage && (
          <ManagementCard
            icon={FiTrash2}
            title="Disk Usage"
            cardData={[
              {
                label: 'Total Disk Space',
                value: diskUsage.LayerSize
                  ? `${Math.round(
                      diskUsage.LayerSize / (1024 * 1024 * 1024)
                    )} GB`
                  : 'N/A',
              },
              { label: 'Containers', value: diskUsage.Containers?.length || 0 },
              { label: 'Images', value: diskUsage.Images?.length || 0 },
              { label: 'Volumes', value: diskUsage.Volumes?.length || 0 },
            ]}
          />
        )}

        {/* Prune Resources */}
        <div className="bg-white dark:bg-grey_7 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-red_6 flex items-center">
            <FiTrash2 className="mr-2" /> Prune Docker Resources
          </h3>
          <button
            className={`btn btn-primary w-full mt-4 ${
              isPruning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => setIsModalOpen(true)}
            disabled={isPruning}
          >
            <span className="text-sm py-2 px-2 rounded-md font-bold text-center bg-red_1 text-red_6 hover:bg-red_2">
              {isPruning ? 'Pruning...' : 'Prune Now'}
            </span>
          </button>
          {pruneResult && (
            <div className="mt-4 text-sm">
              <strong>Space Reclaimed: </strong>
              {Math.round(pruneResult.SpaceReclaimed / (1024 * 1024)) || 0} MB
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        question="Docker 리소스를 정리하시겠습니까?"
        confirmText="Prune"
        closeText="Cancel"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePrune}
      />
    </div>
  );
};

export default Engine;
