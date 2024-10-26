'use client';

import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import {
  FaNetworkWired,
  FaDatabase,
  FaEnvira,
  FaTerminal,
} from 'react-icons/fa';
import EnvAndCmdSettings from './content/envAndCmdSettings';
import MountSettings from './content/mountSettings';
import NetworkSettings from './content/networkSettings';
import PortSettings from './content/portSettings';
import Button from '@/components/button/button';

const TAB_DATA = [
  { label: '네트워크 설정', icon: <FaNetworkWired />, index: 0 },
  { label: '포트 설정', icon: <FaDatabase />, index: 1 },
  { label: '마운트 설정', icon: <FaEnvira />, index: 2 },
  { label: '환경 변수 & 명령어', icon: <FaTerminal />, index: 3 },
];

interface ConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: ConfigurationData) => void;
}

interface ConfigurationData {
  networkSettings: {
    gateway: string;
    ipAddress: string;
  };
  ports: {
    privatePort: number;
    publicPort: number;
  }[];
  mounts: MountConfigProps[];
  env: string[];
  cmd: string[];
}

interface MountConfigProps {
  type: 'bind' | 'volume';
  source: string;
  destination: string;
  name: string;
  driver: string;
  // mode: string;
}

const ConfigurationModal = ({
                              open,
                              onClose,
                              onSave,
                            }: ConfigurationModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [networkSettings, setNetworkSettings] = useState({
    gateway: '192.168.1.1',
    ipAddress: '192.168.1.100',
  });
  const [portSettings, setPortSettings] = useState({
    privatePort: '80',
    publicPort: '8080',
  });
  const [mounts, setMounts] = useState<MountConfigProps[]>([]);
  const [mountConfig, setMountConfig] = useState<MountConfigProps>({
    type: 'bind',
    source: '',
    destination: '/data',
    name: '',
    driver: 'local',
    // mode: 'rw',
  });
  const [envVariables, setEnvVariables] = useState('');
  const [cmd, setCmd] = useState('');

  const handleSave = () => {
    if (!networkSettings.gateway || !networkSettings.ipAddress) {
      alert('네트워크 설정의 게이트웨이와 IP 주소는 필수 항목입니다.');
      return;
    }
    if (!portSettings.privatePort || !portSettings.publicPort) {
      alert('포트 설정의 프라이빗 포트와 퍼블릭 포트는 필수 항목입니다.');
      return;
    }
    if (
      mounts.some(
        (mount) =>
          !mount.destination ||
          (mount.type === 'bind' && !mount.source) ||
          (mount.type === 'volume' && !mount.name),
      )
    ) {
      alert(
        '마운트 설정의 대상 경로와 각 타입에 맞는 필수 항목을 모두 입력해 주세요.',
      );
      return;
    }

    const config: ConfigurationData = {
      networkSettings: {
        gateway: networkSettings.gateway || '',
        ipAddress: networkSettings.ipAddress || '',
      },
      ports:
        portSettings.privatePort && portSettings.publicPort
          ? [
            {
              privatePort: parseInt(portSettings.privatePort, 10),
              publicPort: parseInt(portSettings.publicPort, 10),
            },
          ]
          : [],
      mounts: mounts.length > 0 ? mounts : [],
      env: envVariables ? envVariables.split('\n').filter(Boolean) : [],
      cmd: cmd ? cmd.split('\n').filter(Boolean) : [],
    };

    onSave(config);
    handleClose();
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleClose = () => {
    setActiveTab(0);
    onClose();
  };

  const addMount = () => {
    setMounts([...mounts, mountConfig]);
    setMountConfig({
      type: 'bind',
      source: '',
      destination: '/data',
      name: '',
      driver: 'local',
      // mode: 'rw',
    });
  };

  const removeMount = (index: number) => {
    setMounts(mounts.filter((_, i) => i !== index));
  };

  const handleMountTypeChange = (type: 'bind' | 'volume') => {
    setMountConfig({ ...mountConfig, type, source: '', name: '' });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      className="overflow-hidden"
    >
      <div className="flex justify-between items-center px-6 py-3 bg-grey_0">
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-lg font-bold font-montserrat truncate">
            컨테이너 설정
          </h3>
        </div>
      </div>
      <div className="flex flex-col" style={{ height: '560px' }}>
        <div className="flex flex-grow overflow-hidden">
          <div className="w-56">
            <nav className="flex flex-col items-start bg-white w-full border-r-2 border-grey_2 p-2 h-full">
              {TAB_DATA.map((tab) => (
                <button
                  key={tab.index}
                  className={`flex w-full items-center space-x-2 py-2 px-3 cursor-pointer rounded-md transition-colors mb-2 ${
                    activeTab === tab.index
                      ? 'bg-blue_1 text-grey_6 hover:bg-blue_1'
                      : 'text-grey_7 hover:bg-blue_0'
                  }`}
                  onClick={() => handleTabChange(tab.index)}
                >
                  <span className="inline mr-4">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-grow overflow-hidden p-4">
            {activeTab === 0 && (
              <NetworkSettings
                networkSettings={networkSettings}
                setNetworkSettings={setNetworkSettings}
              />
            )}
            {activeTab === 1 && (
              <PortSettings
                portSettings={portSettings}
                setPortSettings={setPortSettings}
              />
            )}
            {activeTab === 2 && (
              <MountSettings
                mountConfig={mountConfig}
                setMountConfig={setMountConfig}
                addMount={addMount}
                removeMount={removeMount}
                mounts={mounts}
                handleMountTypeChange={handleMountTypeChange}
              />
            )}
            {activeTab === 3 && (
              <EnvAndCmdSettings
                envVariables={envVariables}
                setEnvVariables={setEnvVariables}
                cmd={cmd}
                setCmd={setCmd}
              />
            )}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t space-x-2">
          <Button title={'취소'} onClick={handleClose} color="grey" />
          <Button title={'저장'} onClick={handleSave} />
        </div>
      </div>
    </Dialog>
  );
};

export default ConfigurationModal;
