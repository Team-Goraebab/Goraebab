'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, OptionModal } from '@/components';
import { useStore } from '@/store/cardStore';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useImageStore } from '@/store/imageStore';
interface CardProps {
  id: string;
  name?: string;
  ip?: string;
  size: string;
  tags: string;
  /**
   * running
   * stopped
   */
  active?: string;
  /**
   * primary
   * secondary
   * accent
   * success
   */
  status?: string;
}

interface CardDataProps {
  data: CardProps;
  selectedHostId: string | null;
}

/**
 *
 * @param status card의 상태 값
 * @returns status에 따른 색상을 반환
 */
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

const ImageCard = ({ data, selectedHostId }: CardDataProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const removeImage = useImageStore((state) => state.removeImage);

  const id = uuidv4();
  const { bg1, bg2 } = getStatusColors(data.status || 'primary');
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const addContainerToHost = useStore((state) => state.addContainerToHost);

  const items = [
    { label: 'ID', value: data.id },
    { label: 'SIZE', value: data.size },
    { label: 'TAGS', value: data.tags },
  ];

  const handleOptionClick = () => {
    setShowOptions(!showOptions);
  };

  const handleGetInfo = () => {
    console.log('정보 가져오기 클릭됨');
    console.log(data);
    setShowOptions(false);
  };

  const handleRun = () => {
    if (selectedHostId) {
      const newContainer = {
        id: uuidv4(),
        name: data.name,
        ip: data.ip,
        active: data.active,
      };
      addContainerToHost(selectedHostId, newContainer);
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

  const handleDelete = () => {
    setShowModal(true);
    setShowOptions(false);
  };

  const handleConfirmDelete = () => {
    removeImage(data.id);
    showSnackbar(
      enqueueSnackbar,
      '이미지가 삭제되었습니다.',
      'success',
      '#25BD6B'
    );
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
        <div className="flex justify-between text-grey_4 text-sm mt-2 mb-3 relative">
          <span className={"font-pretendard font-bold text-black"}>
            {data.name}
          </span>
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
              className="text-xs py-1 w-[60px] rounded-md font-bold text-center"
              style={{ backgroundColor: bg1, color: bg2 }}
            >
              {item.label}
            </span>
            <span className="font-semibold text-xs truncate max-w-[150px]">
              {item.value} {item.label === 'SIZE' ? 'MB' : null}
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

export default ImageCard;
