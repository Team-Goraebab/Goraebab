'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import VolumeModal from '../modal/volume/volumeModal';
import { showSnackbar } from '@/utils/toastUtils';
import { useVolumeStore } from '@/store/volumeStore';
import { FiDatabase } from 'react-icons/fi';

interface AddVolumeButtonProps {
  onCreate: (volumeData: any) => void;
}

const AddVolumeButton = ({ onCreate }: AddVolumeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const addVolume = useVolumeStore((state) => state.addVolume);

  /**
   * add vloume handler
   * @param id volume id
   * @param name volume name
   * @param driver volume driver
   * @param mountPoint volume mountPoint
   * @param capacity volume capacity
   */
  const handleCreateVolume = (
    id: string,
    name: string,
    driver: string,
    mountPoint: string,
    capacity: string
  ) => {
    const newVolumeData = {
      id,
      name,
      driver,
      mountPoint,
      capacity,
      status: 'available',
    };

    // 부모 컴포넌트로 생성된 볼륨 데이터 전달
    onCreate(newVolumeData);
    // store에 볼륨 데이터 저장
    addVolume(newVolumeData);
    console.log('new volume ::', newVolumeData);

    showSnackbar(
      enqueueSnackbar,
      '볼륨이 성공적으로 생성되었습니다!',
      'success',
      '#4C48FF'
    );

    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 p-2 w-full text-blue_6 rounded font-bold border border-blue_6"
      >
        Add Volume
      </button>
      {isModalOpen && (
        <VolumeModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateVolume}
        />
      )}
    </>
  );
};

export default AddVolumeButton;
