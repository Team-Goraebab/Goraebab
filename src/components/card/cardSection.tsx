'use client';

import React from 'react';
import { CardContainer } from '@/components';
import { HostCardProps } from './hostCard';
import Draggable from 'react-draggable';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useHostStore } from '@/store/hostStore';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import { useContainerNameStore } from '@/store/containerNameStore';
import { FaTrash, FaHome, FaGlobeAsia } from 'react-icons/fa';
import { VolumeData } from '@/types/type';

interface CardSectionProps {
  hostData: HostCardProps[];
  isHandMode: boolean;
}

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
    clearBridgesForHost,
  } = selectedHostStore();

  const { getContainerName, setContainerName } = useContainerNameStore();
  const { selectedNetwork, setSelectedNetwork, clearSelectedNetwork } =
    useSelectedNetworkStore();

  const allContainers = useStore((state) => state.hostContainers);
  const deleteHost = useHostStore((state) => state.deleteHost);
  const deleteNetwork = useHostStore((state) => state.deleteNetwork);

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

  const handleDeleteHost = (id: string) => {
    deleteHost(id);
    clearBridgesForHost(id);
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
      clearSelectedNetwork();
    } else {
      setSelectedNetwork(hostId, networkName, networkId, uniqueId);
      sessionStorage.setItem('selectedHostIp', hostIp);
      setSelectedHostId(hostId);
      setSelectedHostIp(hostIp);
    }
  };

  const handleDeleteNetwork = (hostId: string, uniqueId: string) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.uniqueId === uniqueId
    ) {
      clearSelectedNetwork();
    }
    deleteNetwork(hostId, uniqueId);
    deleteConnectedBridgeId(hostId, uniqueId);
  };

  const handleContainerNameChange = (
    hostId: string,
    networkId: string,
    containerId: string,
    name: string
  ) => {
    setContainerName(hostId, networkId, containerId, name);
  };

  const formatImageVolumes = (id: string, containers: any) => {
    const formattedVolumes: {
      [networkUniqueId: string]: {
        [containerId: string]: any[];
      };
    } = {};

    containers.forEach((container: any) => {
      const networkUniqueId = id;
      const containerId = container.containerId;

      if (!formattedVolumes[networkUniqueId]) {
        formattedVolumes[networkUniqueId] = {};
      }
      if (!formattedVolumes[networkUniqueId][containerId]) {
        formattedVolumes[networkUniqueId][containerId] = [];
      }

      container.imageVolumes.forEach((volume: any) => {
        formattedVolumes[networkUniqueId][containerId].push({
          Driver: volume.driver,
          Name: volume.name,
        });
      });
    });

    return formattedVolumes;
  };

  return (
    <Draggable disabled={!isHandMode}>
      <div className="flex flex-col gap-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {hostData && hostData.length > 0 ? (
          hostData.map((host) => {
            const containers = allContainers[host.id] || [];
            const networks = connectedBridgeIds[host.id] || [];
            console.log('networks >>>>', networks);
            const isHostSelected =
              selectedNetwork?.hostId === host.id || selectedHostId === host.id;
            return (
              <div key={host.id} className="relative">
                <div
                  className={`transition-all duration-200 ${
                    isHostSelected ? 'transform scale-105' : ''
                  }`}
                >
                  <div
                    onClick={() =>
                      handleHostClick(host.id, host.hostNm, host.hostIp)
                    }
                    className="relative flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-[540px] cursor-pointer overflow-hidden"
                    style={{
                      borderColor: isHostSelected
                        ? host.themeColor.borderColor
                        : 'transparent',
                      borderWidth: '2px',
                    }}
                  >
                    <div
                      className="w-full py-3 px-4"
                      style={{
                        backgroundColor: host.themeColor.bgColor,
                        borderBottom: `2px solid ${host.themeColor.borderColor}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {host.isRemote ? (
                            <FaGlobeAsia
                              className="w-5 h-5"
                              style={{ color: host.themeColor.textColor }}
                            />
                          ) : (
                            <FaHome
                              className="w-5 h-5"
                              style={{ color: host.themeColor.textColor }}
                            />
                          )}
                          <div className="flex flex-col">
                            <span
                              className="text-sm font-bold"
                              style={{ color: host.themeColor.textColor }}
                            >
                              {host.hostNm || 'HOST'}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: host.themeColor.textColor }}
                            >
                              {host.isRemote ? 'Remote' : 'Local'} Host
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className="text-sm font-medium px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: host.themeColor.textColor,
                            }}
                          >
                            {host.isRemote ? host.hostIp : 'localhost'}
                          </span>
                          {selectedHostId === host.id && (
                            <button
                              onClick={() => handleDeleteHost(host.id)}
                              className="p-1.5 rounded-full hover:bg-red-100 transition-colors duration-200"
                            >
                              <FaTrash className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {networks.length > 0 ? (
                        <div className="flex flex-col gap-4 w-full">
                          {networks
                            .filter(
                              (network, index, self) =>
                                index ===
                                self.findIndex((n) => n.name === network.name)
                            )
                            .map((network) => {
                              const formattedImageVolumes = formatImageVolumes(
                                network.uniqueId,
                                network.containers
                              );
                              return network.containers.map((container) => {
                                const containerName =
                                  getContainerName(
                                    host.id,
                                    network.id,
                                    container.containerId
                                  ) || container.containerName;
                                const imageInfo = {
                                  id: container.image.imageId,
                                  name: container.image.name,
                                  tag: container.image.tag,
                                };
                                return (
                                  <CardContainer
                                    key={container.containerId}
                                    networkName={network.name}
                                    networkIp={network.subnet}
                                    containers={[container]}
                                    containerName={containerName}
                                    themeColor={host.themeColor}
                                    onDelete={() =>
                                      handleDeleteNetwork(
                                        host.id,
                                        network.uniqueId
                                      )
                                    }
                                    onSelectNetwork={() =>
                                      handleSelectNetwork(
                                        host.id,
                                        host.hostIp,
                                        network.name,
                                        network.id,
                                        network.uniqueId
                                      )
                                    }
                                    isSelected={
                                      selectedNetwork?.uniqueId ===
                                      network.uniqueId
                                    }
                                    hostIp={host.hostIp}
                                    networkUniqueId={network.uniqueId}
                                    containerId={container.containerId}
                                    onContainerNameChange={(name) =>
                                      handleContainerNameChange(
                                        host.id,
                                        network.id,
                                        container.containerId,
                                        name
                                      )
                                    }
                                    imageInfo={[imageInfo]}
                                    // imageId={container.image.imageId}
                                    // imageName={container.image.name}
                                    // imageTag={container.image.tag}
                                    imageVolumesVal={formattedImageVolumes}
                                  />
                                );
                              });
                            })}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          연결된 네트워크가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">
            No host data available
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default CardSection;
