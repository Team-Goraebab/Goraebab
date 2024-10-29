'use client';

import React, { useState } from 'react';
import { Modal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { selectedHostStore } from '@/store/seletedHostStore';
import { getStatusColors } from '@/utils/statusColorsUtils';
import { formatDateTime } from '@/utils/formatTimestamp';
import { v4 as uuidv4 } from 'uuid';
import { fetchData } from '@/services/apiUtils';
import NetworkDetailModal from '../modal/network/networkDetailModal';
import {
  FiInfo,
  FiTrash,
  FiLink,
  FiCpu,
  FiCalendar,
  FiHardDrive,
  FiSend,
  FiBox,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaNetworkWired } from 'react-icons/fa';
import { Network } from '@/types/type';

interface CardDataProps {
  data: Network;
  onDeleteSuccess: () => void;
}

const NetworkCard = ({ data, onDeleteSuccess }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const id = uuidv4();

  const { selectedHostId, addConnectedBridgeId } = selectedHostStore();
  const { connectedBridgeIds } = selectedHostStore((state) => ({
    connectedBridgeIds: state.connectedBridgeIds,
  }));
  const { bg1, bg2 } = getStatusColors('primary');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const connectedContainers = Object.values(data.Containers || {}).map(
    (container) => `${container.Name} (${container.IPv4Address})`
  );

  const subnet = data.IPAM?.Config?.[0]?.Subnet || 'No Subnet';
  const gateway = data.IPAM?.Config?.[0]?.Gateway || 'No Gateway';

  const networkItems = [
    { label: 'Name', value: data.Name, icon: FiCpu },
    { label: 'Created', value: formatDateTime(data.Created), icon: FiCalendar },
    { label: 'Driver', value: data.Driver, icon: FiHardDrive },
    { label: 'Subnet', value: subnet, icon: FiInfo },
    { label: 'Gateway', value: gateway, icon: FiSend },
    {
      label: 'Containers',
      value:
        connectedContainers.length > 0
          ? connectedContainers.join(', ')
          : 'No connected',
      icon: FiBox,
    },
  ];

  const handleDelete = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/network/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.Id }),
      });
      const result = await res.json();
      if (res.ok) {
        showSnackbar(
          enqueueSnackbar,
          '네트워크가 성공적으로 삭제되었습니다!',
          'success',
          '#4CAF50'
        );
        onDeleteSuccess();
      } else {
        showSnackbar(
          enqueueSnackbar,
          `네트워크 삭제 실패: ${result.error}`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      console.error('네트워크 삭제 요청 중 에러:', error);
      showSnackbar(
        enqueueSnackbar,
        `네트워크 삭제 요청 중 에러: ${error}`,
        'error',
        '#FF4853'
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConnect = () => {
    if (selectedHostId) {
      // 현재 호스트에 연결된 네트워크가 3개 이상인지 확인
      const currentConnections = connectedBridgeIds[selectedHostId] || [];
      if (currentConnections.length >= 3) {
        showSnackbar(
          enqueueSnackbar,
          '네트워크는 최대 3개까지만 연결할 수 있습니다.',
          'error',
          '#FF4853'
        );
        return; // 연결을 중단
      }

      const networkInfo = {
        id: data.Id,
        name: data.Name,
        gateway: gateway,
        subnet: subnet,
        driver: data.Driver,
        scope: data.Scope,
      };

      addConnectedBridgeId(selectedHostId, {
        name: networkInfo.name,
        gateway: networkInfo.gateway,
        driver: networkInfo.driver,
        subnet: networkInfo.subnet,
        scope: networkInfo.scope,
        id: networkInfo.id,
        uniqueId: uuidv4(),
      });

      showSnackbar(
        enqueueSnackbar,
        '네트워크가 성공적으로 연결되었습니다.',
        'success',
        '#4CAF50'
      );
    } else {
      showSnackbar(
        enqueueSnackbar,
        '호스트를 선택해주세요.',
        'error',
        '#FF4853'
      );
    }
  };

  const fetchNetworkDetail = async (id: string) => {
    try {
      const data = await fetchData(`/api/network/detail?id=${id}`);
      if (!data) {
        throw new Error('Failed to fetch network detail');
      }
      return data;
    } catch (error) {
      console.error('Error fetching network detail:', error);
      throw error;
    }
  };

  const handleGetInfo = async () => {
    try {
      const networkDetail = await fetchNetworkDetail(data.Id);
      setDetailData(networkDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching network detail:', error);
      showSnackbar(
        enqueueSnackbar,
        '네트워크 정보를 가져오는데 실패했습니다.',
        'error',
        '#FF4853'
      );
    }
  };

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative bg-white border rounded-lg transition-all duration-300 mb-2 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <FaNetworkWired size={16} className="text-grey_5" />
          <span className="font-pretendard text-sm">Network</span>
        </div>
        <div className="flex items-center space-x-2" />
        <div className="flex">
          <button
            onClick={handleConnect}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Connect Network"
          >
            <FiLink className="text-grey_4" size={16} />
          </button>
          <button
            onClick={handleGetInfo}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Network Info"
          >
            <FiInfo className="text-grey_4" size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Delete Network"
          >
            <FiTrash className="text-grey_4" size={16} />
          </button>
          <button
            onClick={toggleAccordion}
            className="p-2 rounded-full hover:bg-grey_1 transition-colors"
            title="Toggle Details"
          >
            {isExpanded ? (
              <FiChevronUp size={16} className="text-grey_4" />
            ) : (
              <FiChevronDown size={16} className="text-grey_4" />
            )}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4">
          <div className="grid gap-4">
            {networkItems && networkItems.length > 0 ? (
              networkItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: bg1 }}
                  >
                    <item.icon size={16} style={{ color: bg2 }} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-grey_4 font-medium font-pretendard">
                      {item.label}
                    </span>
                    <span className="font-pretendard font-semibold text-sm text-grey_7 truncate max-w-[150px]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">네트워크 항목이 없습니다.</div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        question={`네트워크 [${data.Name}]을 삭제하시겠습니까?`}
      />
      <NetworkDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
    </div>
  );
};

export default NetworkCard;
