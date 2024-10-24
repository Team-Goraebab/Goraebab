'use client';

import React, { useState } from 'react';
import { CardContainer, ConnectBar, HostCard } from '@/components';
import { HostCardProps } from './hostCard';
import Draggable from 'react-draggable';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useHostStore } from '@/store/hostStore';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { FaPencilAlt } from 'react-icons/fa';
import ContainerNameModal from '../modal/container/containerNameModal';

interface CardSectionProps {
  hostData: HostCardProps[];
  isHandMode: boolean;
}

/**
 *
 * @param hostData 호스트 데이터
 * @param isHandMode 손 동작 모드
 * @returns
 */
const CardSection = ({ hostData, isHandMode }: CardSectionProps) => {
  const {
    selectedHostId,
    setSelectedHostId,
    selectedHostName,
    setSelectedHostName,
    selectedHostIp,
    setSelectedHostIp,
    connectedBridgeIds,
    deleteConnectedBridgeId,
  } = selectedHostStore();
  const { selectedNetwork, setSelectedNetwork, clearSelectedNetwork } =
    useSelectedNetworkStore();

  const allContainers = useStore((state) => state.hostContainers);
  const deleteNetwork = useHostStore((state) => state.deleteNetwork);

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editingUniqueId, setEditingUniqueId] = useState<string | null>(null);
  const [containerNames, setContainerNames] = useState<{
    [uniqueId: string]: string;
  }>({});

  const handleHostClick = (id: string, name: string, ip: string) => {
    const newSelectedHostId = selectedHostId === id ? null : id;
    const newSelectedHostName = selectedHostName === name ? null : name;
    const newSelectedHostIp = selectedHostIp === ip ? 'localhost' : ip;

    setSelectedHostId(newSelectedHostId);
    setSelectedHostName(newSelectedHostName);
    setSelectedHostIp(newSelectedHostIp);

    sessionStorage.setItem('selectedHostIp', newSelectedHostIp);

    clearSelectedNetwork();
  };

  const handleSelectNetwork = (
    hostId: string,
    hostIp: string,
    networkName: string,
    networkId: string,
    uniqueId: string
  ) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.uniqueId === uniqueId
    ) {
      // 이미 선택된 네트워크를 다시 클릭하면 선택 해제
      clearSelectedNetwork();
    } else {
      // 새로운 네트워크 선택
      setSelectedNetwork(hostId, networkName, networkId, uniqueId);
      sessionStorage.setItem('selectedHostIp', hostIp);
      // 네트워크를 선택하면 해당 호스트도 자동 선택
      setSelectedHostId(hostId);
      setSelectedHostIp(hostIp);
    }
  };

  const handleDeleteNetwork = (
    hostId: string,
    networkName: string,
    networkId: string,
    uniqueId: string
  ) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.networkName === networkName &&
      selectedNetwork?.networkId === networkId &&
      selectedNetwork?.uniqueId === uniqueId
    ) {
      // 네트워크 삭제 시 선택된 네트워크 해제
      clearSelectedNetwork();
    }
    deleteNetwork(hostId, uniqueId);
    deleteConnectedBridgeId(hostId, uniqueId);
  };

  const handleOpenNameModal = (uniqueId: string) => {
    setEditingUniqueId(uniqueId);
    setIsNameModalOpen(true);
  };

  const handleSaveName = (newName: string) => {
    if (editingUniqueId) {
      setContainerNames((prevNames) => ({
        ...prevNames,
        [editingUniqueId]: newName,
      }));
    }
    setIsNameModalOpen(false);
    setEditingUniqueId(null);
  };

  return (
    <>
      <Draggable disabled={!isHandMode}>
        <div
          className="flex flex-col items-center"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {hostData && hostData.length > 0 ? (
            hostData.map((host, index) => {
              const containers = allContainers[host.id] || [];
              const networks = connectedBridgeIds[host.id] || [];
              const isHostSelected =
                selectedNetwork?.hostId === host.id ||
                selectedHostId === host.id;
              console.log(containerNames[networks[0].uniqueId]);
              return (
                <div key={host.id} className="flex flex-col items-center">
                  <div className="flex flex-row items-center">
                    {networks.length > 0 && (
                      <div className="flex items-center">
                        <div
                          className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-3 py-4 rounded-t-lg content-center`}
                          style={{
                            top: '-2.14rem',
                            left: '1.25rem',
                            zIndex: '10',
                            borderColor: `${host.themeColor.borderColor}`,
                            color: `${host.themeColor.textColor}`,
                            backgroundColor: `${host.themeColor.bgColor}`,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNameModal(networks[0].uniqueId);
                            }}
                          >
                            <FaPencilAlt
                              className="w-4 h-4 mr-1"
                              style={{ color: host.themeColor.borderColor }}
                            />
                          </button>
                          {containerNames[networks[0].uniqueId] ||
                            'container 이름을 설정하세요'}
                        </div>
                        <CardContainer
                          networkName={networks[0].name}
                          networkIp={networks[0].gateway}
                          containers={containers}
                          containerName={containerNames[networks[0].uniqueId]}
                          themeColor={host.themeColor}
                          onDelete={() =>
                            handleDeleteNetwork(
                              host.id,
                              networks[0].name,
                              networks[0].id,
                              networks[0].uniqueId
                            )
                          }
                          onSelectNetwork={() =>
                            handleSelectNetwork(
                              host.id,
                              host.hostIp,
                              networks[0].name,
                              networks[0].id,
                              networks[0].uniqueId
                            )
                          }
                          isSelected={
                            selectedNetwork?.uniqueId === networks[0].uniqueId
                          }
                          hostIp={host.hostIp}
                          networkUniqueId={networks[0].uniqueId}
                        />
                        <ConnectBar rotate={180} themeColor={host.themeColor} />
                      </div>
                    )}
                    <HostCard
                      id={host.id}
                      hostNm={host.hostNm}
                      hostIp={host.hostIp}
                      isRemote={host.isRemote}
                      onClick={() =>
                        handleHostClick(host.id, host.hostNm, host.hostIp)
                      }
                      themeColor={host.themeColor}
                      className={
                        isHostSelected ? 'scale-105 border-blue_5' : ''
                      }
                      isSelectedNetwork={isHostSelected}
                    />
                    {networks.length > 1 && (
                      <div className="flex items-center">
                        <ConnectBar themeColor={host.themeColor} />
                        <div
                          className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-3 py-4 rounded-t-lg content-center`}
                          style={{
                            top: '-2.14rem',
                            right: '1.25rem',
                            zIndex: '10',
                            borderColor: `${host.themeColor.borderColor}`,
                            color: `${host.themeColor.textColor}`,
                            backgroundColor: `${host.themeColor.bgColor}`,
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenNameModal(networks[1].uniqueId);
                            }}
                          >
                            <FaPencilAlt
                              className="w-4 h-4 mr-1"
                              style={{ color: host.themeColor.borderColor }}
                            />
                          </button>
                          {containerNames[networks[1].uniqueId] ||
                            'container 이름을 설정하세요'}
                        </div>
                        <CardContainer
                          networkName={networks[1].name}
                          networkIp={networks[1].gateway}
                          containers={containers}
                          containerName={containerNames[networks[1].uniqueId]}
                          themeColor={host.themeColor}
                          onDelete={() =>
                            handleDeleteNetwork(
                              host.id,
                              networks[1].name,
                              networks[1].id,
                              networks[1].uniqueId
                            )
                          }
                          onSelectNetwork={() =>
                            handleSelectNetwork(
                              host.id,
                              host.hostIp,
                              networks[1].name,
                              networks[1].id,
                              networks[1].uniqueId
                            )
                          }
                          isSelected={
                            selectedNetwork?.uniqueId === networks[1].uniqueId
                          }
                          hostIp={host.hostIp}
                          networkUniqueId={networks[1].uniqueId}
                        />
                      </div>
                    )}
                  </div>
                  {networks.length > 2 && (
                    <div className="flex flex-col items-center">
                      <ConnectBar
                        rotate={90}
                        themeColor={host.themeColor}
                        length={'long'}
                      />
                      <div
                        className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-3 py-4 rounded-t-lg content-center`}
                        style={{
                          bottom: '18.05rem',
                          right: '32rem',
                          zIndex: '10',
                          borderColor: `${host.themeColor.borderColor}`,
                          color: `${host.themeColor.textColor}`,
                          backgroundColor: `${host.themeColor.bgColor}`,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNameModal(networks[2].uniqueId);
                          }}
                        >
                          <FaPencilAlt
                            className="w-4 h-4 mr-1"
                            style={{ color: host.themeColor.borderColor }}
                          />
                        </button>
                        {containerNames[networks[2].uniqueId] ||
                          'container 이름을 설정하세요'}
                      </div>
                      <CardContainer
                        networkName={networks[2].name}
                        networkIp={networks[2].gateway}
                        containers={containers}
                        containerName={containerNames[networks[2].uniqueId]}
                        themeColor={host.themeColor}
                        onDelete={() =>
                          handleDeleteNetwork(
                            host.id,
                            networks[2].name,
                            networks[2].id,
                            networks[2].uniqueId
                          )
                        }
                        onSelectNetwork={() =>
                          handleSelectNetwork(
                            host.id,
                            host.hostIp,
                            networks[2].name,
                            networks[2].id,
                            networks[2].uniqueId
                          )
                        }
                        isSelected={
                          selectedNetwork?.uniqueId === networks[2].uniqueId
                        }
                        hostIp={host.hostIp}
                        networkUniqueId={networks[2].uniqueId}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center">호스트 데이터가 없습니다.</div>
          )}
        </div>
      </Draggable>
      <ContainerNameModal
        open={isNameModalOpen}
        containerName={
          editingUniqueId ? containerNames[editingUniqueId] || '' : ''
        }
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveName}
        onChange={(name) => {
          if (editingUniqueId) {
            setContainerNames((prevNames) => ({
              ...prevNames,
              [editingUniqueId]: name,
            }));
          }
        }}
      />
    </>
  );
};

export default CardSection;
