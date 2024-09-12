'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { selectedHostStore } from '@/store/seletedHostStore';

interface NetworkProps {
  id: string;
  name: string;
  subnet: string;
  gateway: string;
  driver: string;
  connectedContainers: {
    id: string;
    name: string;
    ip: string;
    status: string;
  }[];
  status: string;
}

interface CardDataProps {
  data: NetworkProps;
  selectedHostId: string | null;
}

const getStatusColors = (status: string) => {
  switch (status) {
    case 'primary':
      return { bg1: '#d2d1f6', bg2: '#4C48FF' };
    case 'secondary':
      return { bg1: '#f6d4d6', bg2: '#FF4853' };
    case 'accent':
      return { bg1: '#f6e3d1', bg2: '#FFA048' };
    case 'success':
      return { bg1: '#d1f6e2', bg2: '#25BD6B' };
    default:
      return { bg1: '#d1d1d1', bg2: '#7F7F7F' };
  }
};

/**
 * 
 * @param data 네트워크 데이터
 * @param selectedHostId 선택한 호스트 아이디 
 * @returns 
 */
const NetworkCard = ({ data, selectedHostId }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { bg1, bg2 } = getStatusColors('primary');
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  const networkItems = [
    { label: 'Name', value: data.name },
    { label: 'Subnet', value: data.subnet },
    { label: 'Gateway', value: data.gateway },
    { label: 'Driver', value: data.driver },
    {
      label: 'Containers',
      value:
        data.connectedContainers
          .map((container) => `${container.name} (${container.ip})`)
          .join(', ') || 'No connected containers',
    },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    console.log('삭제가 확인되었습니다.');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConnect = () => {
    if (selectedHostId) {
      const networkInfo = {
        id: data.id,
        name: data.name,
        subnet: data.subnet,
        networkIp: data.gateway,
        driver: data.driver,
        connectedContainers: data.connectedContainers.map((container) => ({
          id: container.id,
          name: container.name,
          ip: container.ip,
          status: container.status,
        })),
        status: data.status,
        gateway: data.gateway,
      };

      addConnectedBridgeId(selectedHostId, networkInfo);
      console.log('Host selected and network connected');
    } else {
      showSnackbar(
        enqueueSnackbar,
        '호스트를 선택해주세요.',
        'error',
        '#FF4853'
      );
      console.log('호스트를 선택하세요');
    }
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cardRef]);

  return (
    <div
      ref={cardRef}
      className="relative flex items-start px-3 pt-1 pb-3 bg-grey_0 shadow rounded-lg mb-4"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-lg"
        style={{ backgroundColor: bg2 }}
      />
      <div className="ml-4 flex flex-col w-full">
        <div className="flex justify-end text-grey_4 text-sm mb-3 relative">
          <span
            className="font-semibold text-xs cursor-pointer"
            onClick={handleOptionClick}
          >
            •••
          </span>
          {showOptions && (
            <div className="absolute top-4 left-16">
              <OptionModal
                onTopHandler={() => console.log('정보 가져오기 클릭됨')}
                onMiddleHandler={handleConnect}
                onBottomHandler={handleDelete}
              />
            </div>
          )}
        </div>
        {networkItems.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3">
            <span
              className="text-xs py-1.5 w-[70px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default NetworkCard;
