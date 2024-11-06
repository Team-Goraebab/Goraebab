'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from '@nextui-org/react';
import { HiOutlineHand, HiOutlineHome } from 'react-icons/hi';
import { AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
import { FaDocker, FaPlay, FaPause, FaStop, FaEllipsisV } from 'react-icons/fa';
import { HiOutlineCursorClick } from 'react-icons/hi';
import { useHostStore } from '@/store/hostStore';
import { useHandModeStore } from '@/store/handModeStore';
import { useSnackbar } from 'notistack';
import { useBlueprintStore } from '@/store/blueprintStore';
import { showSnackbar } from '@/utils/toastUtils';
import HostModal from '@/components/modal/host/hostModal';
import SystemInfoModal from '@/components/modal/daemon/systemModal';
import VersionDetailModal from '@/components/modal/daemon/versionModal';
import BlueprintListModal from '@/components/modal/blueprint/blueprintListModal';
import { createBlueprint } from '@/services/blueprint/api';
import { FiList } from 'react-icons/fi';
import { useContainerNameStore } from '@/store/containerNameStore';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import DeleteBlueprintModal from '../modal/blueprint/deleteBlueprintModal';
import SaveBlueprintModal from '../modal/blueprint/saveBlueprintModal';
import { useContainerStore } from '@/store/containerStore';
import { useMenuStore } from '@/store/menuStore';
import { generateId } from '@/utils/randomId';

const ActionTabs = () => {
  const [isHostModalOpen, setIsHostModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [blueprintName, setBlueprintName] = useState<string>('');
  const [isDockerRemote, setIsDockerRemote] = useState<boolean>(false);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [engineStatus, setEngineStatus] = useState<
    'connect' | 'disconnect' | 'connecting'
  >('disconnect');
  const [versionData, setVersionData] = useState<any>();
  const [systemData, setSystemData] = useState<any>();
  const [showVersionInfo, setShowVersionInfo] = useState<boolean>(false);
  const [showSystemInfo, setShowSystemInfo] = useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);

  const { setSucceededContainers } = useContainerStore.getState();
  const { setActiveId } = useMenuStore();

  const deleteAllHosts = useHostStore((state) => state.deleteAllHosts);
  const clearConnectedBridges = selectedHostStore(
    (state) => state.clearConnectedBridges
  );
  const clearSelectedNetwork = useSelectedNetworkStore(
    (state) => state.clearSelectedNetwork
  );
  const clearAllContainerNames = useContainerNameStore(
    (state) => state.clearAllContainerNames
  );
  const isHandMode = useHandModeStore((state) => state.isHandMode);
  const setHandMode = useHandModeStore((state) => state.setHandMode);
  const { enqueueSnackbar } = useSnackbar();
  const mappedData = useBlueprintStore((state) => state.mappedData);

  async function fetchConnectDaemon() {
    try {
      setEngineStatus('connecting');
      const response = await axios.get(`api/daemon/version`);
      setEngineStatus('connect');
      setVersionData(response.data);
      showSnackbar(
        enqueueSnackbar,
        '도커 엔진이 연결되었습니다.',
        'success',
        '#4CAF50'
      );
    } catch (error) {
      setEngineStatus('disconnect');
      showSnackbar(
        enqueueSnackbar,
        '도커 엔진이 실행되지 않았습니다.',
        'info',
        '#7F7F7F'
      );
    }
  }

  useEffect(() => {
    fetchConnectDaemon();
  }, []);

  async function fetchSystemInfo() {
    try {
      const response = await axios.get(`api/daemon/system`);
      setSystemData(response.data);
    } catch (error) {
      showSnackbar(
        enqueueSnackbar,
        '시스템 정보를 가져오는데 실패했습니다.',
        'error',
        '#FF4853'
      );
    }
  }

  const handleEngineStartStop = () => {
    if (engineStatus === 'connect' || engineStatus === 'connecting') {
      setEngineStatus('disconnect');
      showSnackbar(
        enqueueSnackbar,
        '도커 엔진 연결이 해제되었습니다.',
        'info',
        '#7F7F7F'
      );
    } else {
      fetchConnectDaemon();
    }
  };

  const handleDelete = () => {
    deleteAllHosts();
    clearAllContainerNames();
    clearSelectedNetwork();
    clearConnectedBridges();
    setIsDeleteModalOpen(false);
    showSnackbar(
      enqueueSnackbar,
      '설계도가 삭제되었습니다.',
      'success',
      '#4CAF50'
    );
  };

  const hostId = generateId('host-');
  const networkId = generateId('network-');
  const contianerId = generateId('contianer-');

  const handleSaveSubmit = async () => {
    const requestBody = {
      blueprintName,
      processedData: {
        host: mappedData.map((host) => ({
          name: host.hostNm,
          isRemote: host.isRemote,
          ip: host.isRemote ? remoteUrl : null,
          id: hostId,
          network: host.networks.map((network: any) => ({
            name: network.name,
            id: networkId,
            driver: network.driver || 'bridge',
            ipam: {
              config: [
                {
                  subnet: network.subnet || '172.19.0.0/16',
                },
              ],
            },
            containers: network.containers.map((container: any) => ({
              containerName: container.containerName,
              containerId: contianerId,
              image: {
                imageId: network.droppedImages[0].imageId || '',
                name: network.droppedImages[0].name || '',
                tag: network.droppedImages[0].tag || '',
              },
              networkSettings: network.configs[0].networkSettings || {
                gateway: '192.168.1.1',
                ipAddress: '192.168.1.100',
              },
              ports: Array.isArray(network.configs[0].ports)
                ? network.configs[0].ports
                : [
                    {
                      privatePort: 80,
                      publicPort: 8080,
                    },
                  ],
              mounts: network.configs[0].mounts || [],
              env: network.configs[0].env || [],
              cmd: network.configs[0].cmd || [],
            })),
          })),
          volume: host.networks.flatMap(
            (network: any) => network.imageVolumes || []
          ),
        })),
      },
    };

    console.log(mappedData);

    try {
      if (!mappedData || !Array.isArray(mappedData)) {
        showSnackbar(
          enqueueSnackbar,
          '설계도가 유효하지 않습니다.',
          'error',
          '#FF4853'
        );
        return;
      }

      const res = await createBlueprint(requestBody);

      if (res.status === 200 || res.status === 201) {
        const failedContainers = res.data.failedContainers || [];
        const succeededContainers = res.data.succeededContainers || [];

        setSucceededContainers([]);
        setSucceededContainers(
          succeededContainers.map((container: any) => container.containerName)
        );

        showSnackbar(
          enqueueSnackbar,
          `설계도를 성공적으로 전송했습니다!`,
          'success',
          '#4CAF50'
        );

        setActiveId(1);

        // 성공한 컨테이너
        if (succeededContainers.length > 0) {
          showSnackbar(
            enqueueSnackbar,
            `성공한 컨테이너: ${succeededContainers
              .map((container: any) => container.containerName)
              .join(', ')}`,
            'info',
            '#7F7F7F'
          );
        }

        // 실패한 컨테이너
        if (failedContainers.length > 0) {
          showSnackbar(
            enqueueSnackbar,
            `실패한 컨테이너: ${failedContainers
              .map((container: any) => container.containerName)
              .join(', ')}`,
            'info',
            '#7F7F7F'
          );
        }

        setIsSaveModalOpen(false);
      } else if (res.status === 400) {
        showSnackbar(
          enqueueSnackbar,
          `설계도 전송 실패: ${
            res.data.error || res.data.message || '잘못된 요청입니다.'
          }`,
          'error',
          '#FF4853'
        );
      } else if (res.status === 500) {
        showSnackbar(
          enqueueSnackbar,
          `설계도 전송 실패: ${
            res.data.message || '서버 내부 오류가 발생했습니다.'
          }`,
          'error',
          '#FF4853'
        );
      } else {
        showSnackbar(
          enqueueSnackbar,
          `설계도 전송 실패: ${
            res.data.error || '알 수 없는 오류가 발생했습니다.'
          }`,
          'error',
          '#FF4853'
        );
      }
    } catch (error) {
      showSnackbar(
        enqueueSnackbar,
        `설계도 전송 실패: 서버 혹은 네트워크(Port) 확인이 필요합니다.`,
        'error',
        '#FF4853'
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9]">
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-1.5 items-center">
          <div
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
              engineStatus === 'connect'
                ? 'bg-green-100 text-green-600'
                : engineStatus === 'connecting'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            <FaDocker size={16} />
            <span className="text-sm font-medium">
              {engineStatus === 'connect'
                ? '연결됨'
                : engineStatus === 'connecting'
                ? '연결 중...'
                : '연결 안됨'}
            </span>
          </div>
          <Button
            isIconOnly
            size="sm"
            className="ml-1 bg-transparent"
            onClick={handleEngineStartStop}
          >
            {engineStatus === 'connect' ? (
              <FaStop size={12} className={'text-gray-700'} />
            ) : engineStatus === 'connecting' ? (
              <FaPause size={12} className={'text-gray-700'} />
            ) : (
              <FaPlay size={12} className={'text-gray-700'} />
            )}
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" className="ml-1 bg-transparent">
                <FaEllipsisV size={12} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Docker Info Actions">
              <DropdownItem
                key="version"
                onClick={() => setShowVersionInfo(true)}
              >
                버전 정보
              </DropdownItem>
              <DropdownItem
                key="system"
                onClick={() => {
                  fetchSystemInfo();
                  setShowSystemInfo(true);
                }}
              >
                시스템 정보
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div className="h-6 w-px bg-gray-300" />
          <Tooltip content={'호스트 추가'} showArrow delay={200}>
            <Button
              isIconOnly
              className="bg-white"
              onClick={() => setIsHostModalOpen(true)}
            >
              <HiOutlineHome size={20} />
            </Button>
          </Tooltip>
          <Tooltip content={'설계도 목록'} showArrow delay={200}>
            <Button
              isIconOnly
              className="bg-white"
              onClick={() => setIsListModalOpen(true)}
            >
              <FiList size={20} />
            </Button>
          </Tooltip>
          <Tooltip content={'설계도 삭제'} showArrow delay={200}>
            <Button
              isIconOnly
              className="bg-white"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <AiOutlineDelete className="text-red_6" size={20} />
            </Button>
          </Tooltip>
          <Tooltip content={'설계도 저장'} showArrow delay={200}>
            <Button
              isIconOnly
              className="bg-white"
              onClick={() => setIsSaveModalOpen(true)}
            >
              <AiOutlineSave className="text-blue_6" size={20} />
            </Button>
          </Tooltip>
          <div className="h-6 w-px bg-gray-300" />

          <Button
            isIconOnly
            className={`${!isHandMode ? 'bg-blue_1 text-blue_6' : 'bg-white'}`}
            onClick={() => setHandMode(false)}
          >
            <HiOutlineCursorClick size={20} />
          </Button>

          <Button
            isIconOnly
            className={`${isHandMode ? 'bg-blue_1 text-blue_6' : 'bg-white'}`}
            onClick={() => setHandMode(true)}
          >
            <HiOutlineHand size={20} />
          </Button>
        </div>
      </div>
      {isHostModalOpen && (
        <HostModal
          isOpen={isHostModalOpen}
          onClose={() => setIsHostModalOpen(false)}
        />
      )}

      <DeleteBlueprintModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
      <SaveBlueprintModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveSubmit}
        blueprintName={blueprintName}
        setBlueprintName={setBlueprintName}
        isDockerRemote={isDockerRemote}
        setIsDockerRemote={setIsDockerRemote}
        remoteUrl={remoteUrl}
        setRemoteUrl={setRemoteUrl}
      />
      <VersionDetailModal
        open={showVersionInfo}
        onClose={() => setShowVersionInfo(false)}
        data={versionData}
      />
      <SystemInfoModal
        open={showSystemInfo}
        onClose={() => setShowSystemInfo(false)}
        data={systemData}
      />
      <BlueprintListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </>
  );
};

export default ActionTabs;
