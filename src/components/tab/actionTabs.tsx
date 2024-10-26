'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Checkbox, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@nextui-org/react';
import { HiOutlineHome } from 'react-icons/hi';
import { AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
import { FaRegHandPaper, FaDocker, FaPlay, FaPause, FaStop, FaEllipsisV } from 'react-icons/fa';
import { HiOutlineCursorClick } from 'react-icons/hi';
import { useHostStore } from '@/store/hostStore';
import { useHandModeStore } from '@/store/handModeStore';
import { useSnackbar } from 'notistack';
import { useBlueprintStore } from '@/store/blueprintStore';
import { showSnackbar } from '@/utils/toastUtils';
import HostModal from '@/components/modal/host/hostModal';
import SystemInfoModal from '@/components/modal/daemon/systemModal';
import VersionDetailModal from '@/components/modal/daemon/versionModal';

const ActionTabs = () => {
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [isDockerRemote, setIsDockerRemote] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('');
  const [engineStatus, setEngineStatus] = useState<'connect' | 'disconnect' | 'connecting'>('disconnect');
  const [versionData, setVersionData] = useState<any>();
  const [systemData, setSystemData] = useState<any>();
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  const deleteAllHosts = useHostStore((state) => state.deleteAllHosts);
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
      showSnackbar(enqueueSnackbar, '도커 엔진이 연결되었습니다.', 'success', '#4CAF50');
    } catch (error) {
      setEngineStatus('disconnect');
      showSnackbar(enqueueSnackbar, '도커 엔진이 실행되지 않았습니다.', 'info', '#7F7F7F');
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
      showSnackbar(enqueueSnackbar, '시스템 정보를 가져오는데 실패했습니다.', 'error', '#FF4853');
    }
  }

  const handleEngineStartStop = () => {
    if (engineStatus === 'connect' || engineStatus === 'connecting') {
      setEngineStatus('disconnect');
      showSnackbar(enqueueSnackbar, '도커 엔진 연결이 해제되었습니다.', 'info', '#7F7F7F');
    } else {
      fetchConnectDaemon();
    }
  };

  const handleDelete = () => {
    deleteAllHosts();
    setIsDeleteModalOpen(false);
    showSnackbar(enqueueSnackbar, '설계도가 삭제되었습니다.', 'success', '#4CAF50');
  };

  const handleSaveSubmit = async () => {
    try {
      if (!mappedData || !Array.isArray(mappedData)) {
        showSnackbar(enqueueSnackbar, '매핑된 데이터가 유효하지 않습니다.', 'error', '#FF4853');
        return;
      }

      const requestBody = {
        blueprintName,
        processedData: {
          host: mappedData.map((host) => ({
            name: host.hostNm,
            isLocal: !isDockerRemote,
            ip: isDockerRemote ? remoteUrl : null,
            network: Array.isArray(host.networks)
              ? host.networks.map((network) => ({
                name: network.name,
                driver: network.driver || 'bridge',
                ipam: {
                  config: [{ subnet: network.subnet || '' }],
                },
                containers: [
                  {
                    containerName: network.containerName || null,
                    image: {
                      imageId: network.droppedImages?.[0]?.id || '',
                      name: network.droppedImages?.[0]?.name || '',
                      tag: network.droppedImages?.[0]?.tag || '',
                    },
                    networkSettings: network.networkSettings || {},
                    ports: network.ports || [],
                    mounts: network.mounts || [],
                    env: network.env || [],
                    cmd: network.cmd || [],
                  },
                ],
              }))
              : [],
            volume: Array.isArray(host.imageVolumes)
              ? host.imageVolumes.map((volume) => ({
                name: volume.Name,
                driver: volume.Driver,
              }))
              : [],
          })),
        },
      };

      const res = await fetch('/api/blueprint/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();
      if (res.ok) {
        showSnackbar(enqueueSnackbar, '설계도를 성공적으로 전송했습니다!', 'success', '#4CAF50');
        setIsSaveModalOpen(false);
      } else {
        showSnackbar(enqueueSnackbar, `설계도 전송 실패: ${result.error}`, 'error', '#FF4853');
      }
    } catch (error) {
      showSnackbar(enqueueSnackbar, '설계도 전송 실패 중 에러가 발생했습니다.', 'error', '#FF4853');
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9]">
        <div className="bg-white rounded-xl shadow-lg p-2 flex gap-1.5 items-center">
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
            engineStatus === 'connect'
              ? 'bg-green-100 text-green-600'
              : engineStatus === 'connecting'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
          }`}>
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
              <FaStop size={12} />
            ) : engineStatus === 'connecting' ? (
              <FaPause size={12} />
            ) : (
              <FaPlay size={12} />
            )}
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                className="ml-1 bg-transparent"
              >
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

          {/* Existing Action Buttons */}
          <Button
            isIconOnly
            className="bg-white"
            onClick={() => setIsHostModalOpen(true)}
          >
            <HiOutlineHome size={20} />
          </Button>

          <Button
            isIconOnly
            className="bg-white"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <AiOutlineDelete className="text-red_6" size={20} />
          </Button>

          <Button
            isIconOnly
            className="bg-white"
            onClick={() => setIsSaveModalOpen(true)}
          >
            <AiOutlineSave className="text-blue_6" size={20} />
          </Button>

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
            <FaRegHandPaper size={20} />
          </Button>
        </div>
      </div>

      {/* Modals */}
      {isHostModalOpen && (
        <HostModal isOpen={isHostModalOpen} onClose={() => setIsHostModalOpen(false)} />
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>설계도 삭제</ModalHeader>
          <ModalBody>설계도를 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button color="danger" onPress={handleDelete}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)}>
        <ModalContent>
          <ModalHeader>설계도 저장</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              placeholder="설계도 이름을 입력하세요"
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
            />
            <Checkbox isSelected={isDockerRemote} onValueChange={setIsDockerRemote}>
              Docker Remote
            </Checkbox>
            {isDockerRemote && (
              <Input
                placeholder="Remote URL을 입력하세요"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={() => setIsSaveModalOpen(false)}>
              취소
            </Button>
            <Button color="primary" onPress={handleSaveSubmit}>
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
    </>
  );
};

export default ActionTabs;
