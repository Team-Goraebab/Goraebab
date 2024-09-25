import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import BridgeModal from '../modal/network/bridgeModal';
import { v4 as uuidv4 } from 'uuid';

interface AddBridgeButtonProps {
  onCreate: (networkData: any) => void; // 네트워크 생성 시 데이터를 부모에게 전달
}

const AddBridgeButton = ({ onCreate }: AddBridgeButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateBridge = (
    id: string,
    name: string,
    subnet: string,
    gateway: string,
    driver: string
  ) => {
    // 생성된 네트워크 데이터 형식 맞추기
    const newNetworkData = {
      id, // 유니크 ID 생성
      name, // 사용자가 입력한 네트워크 이름을 그대로 사용
      subnet,
      gateway,
      driver,
      connectedContainers: [],
      status: 'active', // 네트워크 상태를 active로 설정 (필요에 따라 수정)
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
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 p-2 w-full text-white rounded font-bold bg-blue_6"
      >
        Add Custom Bridge
      </button>
      {isModalOpen && (
        <BridgeModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateBridge} // 네트워크 생성 데이터를 처리하는 함수 전달
        />
      )}
    </>
  );
};

export default AddBridgeButton;
