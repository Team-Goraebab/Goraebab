'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import ContainerModal from '../modal/container/containerModal';
import LargeButton from './largeButton';

interface AddContainerButtonProps {
  onCreate: (containerData: any) => void;
}

const AddContainerButton = ({ onCreate }: AddContainerButtonProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      <LargeButton title={'Container'} onClick={() => setIsModalOpen(true)} />
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
