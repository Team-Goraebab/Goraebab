'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import ContainerModal from '../modal/container/containerModal';

interface AddContainerButtonProps {
  onCreate: (containerData: any) => void;
}

const AddContainerButton = ({ onCreate }: AddContainerButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddContainer = (containerData: any) => {
    // 부모 컴포넌트로 컨테이너 데이터 전달
    onCreate(containerData);

    // 성공 메시지 표시
    showSnackbar(
      enqueueSnackbar,
      '컨테이너가 성공적으로 추가되었습니다!',
      'success',
      '#4C48FF'
    );

    // 모달 닫기
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 p-2 w-full text-white rounded font-bold bg-blue_2"
      >
        Add Container
      </button>
      {isModalOpen && (
        <ContainerModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddContainer}
        />
      )}
    </>
  );
};

export default AddContainerButton;
