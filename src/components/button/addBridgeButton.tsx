'use client';

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import BridgeModal from '../modal/network/bridgeModal';
import LargeButton from './largeButton';

interface AddBridgeButtonProps {
  onCreate: (networkData: any) => void;
}

const AddBridgeButton = ({ onCreate }: AddBridgeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * add bridge handler
   * @param id bridge id
   * @param name bridge name
   * @param subnet bridge subnet
   * @param gateway bridge gateway
   * @param driver bridge driver
   */
  const handleCreateBridge = (
    id: string,
    name: string,
    subnet: string,
    gateway: string,
    driver: string
  ) => {
    const newNetworkData = {
      id,
      name,
      subnet,
      gateway,
      driver,
      connectedContainers: [],
      status: 'active',
    };

    // 부모 컴포넌트로 생성된 네트워크 데이터 전달
    onCreate(newNetworkData);
    console.log('new ::', newNetworkData);

    showSnackbar(
      enqueueSnackbar,
      '브리지 네트워크가 성공적으로 생성되었습니다!',
      'success',
      '#4C48FF'
    );

    setIsModalOpen(false);
  };

  return (
    <>
      <LargeButton
        title={'Custom Bridge'}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <BridgeModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBridge}
        />
      )}
    </>
  );
};

export default AddBridgeButton;
