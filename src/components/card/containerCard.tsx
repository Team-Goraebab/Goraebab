'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useStore } from '@/store/cardStore';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { useContainerStore } from '@/store/containerStore'; // 새로운 전역 상태 가져오기

interface Volume {
  id: string;
  name: string;
  driver: string;
  mountPoint: string;
}

interface CardProps {
  id: string;
  name?: string;
  ip?: string;
  size: string;
  tags: string;
  active?: string;
  status: string;
  image?: string;
  volumes?: Volume[];
  network?: string;
}

interface CardDataProps {
  data: CardProps;
  selectedHostId: string | null;
  onSelectNetwork?: (networkName: string) => void;
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
 * @param data 컨테이너 정보
 * @param selectedHostId 선택한 호스트 id
 * @returns
 */
const ContainerCard = ({ data, selectedHostId }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedNetwork } = useSelectedNetworkStore();
  const { bg1, bg2 } = getStatusColors(data.status || 'primary');
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addContainer, assignImageToContainer, assignNetworkToContainer } =
    useContainerStore();

  const items = [
    { label: 'ID', value: data.id },
    { label: 'IMAGE', value: data.image },
    { label: 'NETWORK', value: data.network },
    { label: 'TAGS', value: data.tags },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleGetInfo = () => {
    console.log('정보 가져오기 클릭됨');
    setShowOptions(false);
  };

  const handleRun = () => {
    if (!selectedNetwork) {
      showSnackbar(
        enqueueSnackbar,
        '네트워크를 선택해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    if (selectedHostId) {
      const newContainer = {
        id: uuidv4(),
        name: data.name || '',
        ip: data.ip || '',
        size: data.size,
        tags: data.tags,
        active: data.active || 'false',
        status: 'running',
        imageId: data.id, // 현재 카드의 ID를 이미지 ID로 사용
      };

      addContainer(newContainer);
      assignImageToContainer(newContainer.id, data.id);
      assignNetworkToContainer(newContainer.id, selectedNetwork.hostId);

      showSnackbar(
        enqueueSnackbar,
        `호스트 ${selectedHostId}의 ${selectedNetwork} 네트워크에서 컨테이너가 실행되었습니다.`,
        'success',
        '#4C48FF'
      );
    } else {
      showSnackbar(
        enqueueSnackbar,
        '호스트를 선택해주세요.',
        'error',
        '#FF4853'
      );
    }
    setShowOptions(false);
  };

  const handleDelete = () => {
    console.log('삭제하기 클릭됨');
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
                onTopHandler={handleGetInfo}
                onMiddleHandler={handleRun}
                onBottomHandler={handleDelete}
              />
            </div>
          )}
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mt-[5px] space-x-3.5">
            <span
              className="text-xs py-1 w-[65px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value}
            </span>
          </div>
        ))}
        {/* 볼륨 정보 표시 */}
        <div className="flex mt-2">
          <p
            className="text-xs py-1 w-[65px] h-6 mr-2 rounded-md font-bold text-center mb-2"
            style={{ backgroundColor: bg1, color: bg2 }}
          >
            VOLUME
          </p>
          <div className="max-h-32 overflow-y-auto">
            {data.volumes?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col mb-2 p-1 border rounded"
              >
                <p className="text-xs font-semibold">
                  {typeof item === 'string' ? item : item.name}
                </p>
                {item.driver && (
                  <p className="text-xs">Driver: {item.driver}</p>
                )}
                {item.mountPoint && (
                  <p className="text-xs">Mount: {item.mountPoint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ContainerCard;
