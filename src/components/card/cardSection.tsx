'use client';

import React, { useState } from 'react';
import { CardContainer, HostCard } from '@/components';
import { HostCardProps } from './hostCard';
import Draggable from 'react-draggable';
import { useStore } from '@/store/cardStore';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useHostStore } from '@/store/hostStore';
import { useSelectedNetworkStore } from '@/store/selectedNetworkStore';
import {
  Card,
  CardBody,
} from '@nextui-org/react';

interface CardSectionProps {
  hostData: HostCardProps[];
  isHandMode: boolean;
}

interface ContainerNames {
  [key: string]: string;
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
  } = selectedHostStore();

  const { selectedNetwork, setSelectedNetwork, clearSelectedNetwork } = useSelectedNetworkStore();
  const allContainers = useStore((state) => state.hostContainers);
  const deleteNetwork = useHostStore((state) => state.deleteNetwork);

  const [containerNames, setContainerNames] = useState<ContainerNames>({});

  const handleHostClick = (id: string, name: string, ip: string) => {
    const newSelectedHostId = selectedHostId === id ? null : id;
    const newSelectedHostName = selectedHostName === name ? null : name;
    const newSelectedHostIp = selectedHostIp === ip ? 'localhost' : ip;

    setSelectedHostId(newSelectedHostId);
    setSelectedHostName(newSelectedHostName);
    setSelectedHostIp(newSelectedHostIp);

    sessionStorage.setItem('selectedHostIp', newSelectedHostIp || 'localhost');
    clearSelectedNetwork();
  };

  const handleDeleteNetwork = (hostId: string, networkName: string, networkId: string) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.networkName === networkName &&
      selectedNetwork?.networkId === networkId
    ) {
      clearSelectedNetwork();
    }
    deleteNetwork(hostId, networkName, networkId);
    deleteConnectedBridgeId(hostId, networkId);
  };

  const handleSelectNetwork = (
    hostId: string,
    hostIp: string,
    networkName: string,
    networkId: string,
  ) => {
    if (
      selectedNetwork?.hostId === hostId &&
      selectedNetwork?.networkName === networkName &&
      selectedNetwork?.networkId === networkId
    ) {
      clearSelectedNetwork();
    } else {
      setSelectedNetwork(hostId, networkName, networkId);
      sessionStorage.setItem('selectedHostIp', hostIp);
      setSelectedHostId(hostId);
      setSelectedHostIp(hostIp);
    }
  };

  const calculateHostPosition = (index: number, totalHosts: number) => {
    const radius = Math.min(window.innerWidth / 3, window.innerHeight / 3);
    const angle = (2 * Math.PI * index) / totalHosts;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  };

  const calculateNetworkPositions = (
    hostPosition: { x: number; y: number },
    networkCount: number,
    index: number,
  ) => {
    const radius = 300; // 호스트로부터의 기본 거리
    const angleStep = (2 * Math.PI) / Math.max(networkCount, 1); // 네트워크 간의 각도

    return Array(networkCount)
      .fill(0)
      .map((_, i) => {
        const angle = index * (Math.PI / 4) + i * angleStep; // 시작 각도 + 각 네트워크의 간격
        return {
          x: hostPosition.x + radius * Math.cos(angle),
          y: hostPosition.y + radius * Math.sin(angle),
        };
      });
  };

  const renderConnector = (startX: number, startY: number, endX: number, endY: number, color: string) => {
    const path = `M ${startX} ${startY} L ${endX} ${endY}`;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <path
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  return (
    <Draggable disabled={!isHandMode}>
      <div className="container mx-auto relative" style={{ height: '100vh', width: '100vw' }}>
        {hostData && hostData.length > 0 ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {hostData.map((host, index) => {
              const hostPosition = calculateHostPosition(index, hostData.length);
              const networks = connectedBridgeIds[host.id] || [];
              const containers = allContainers[host.id] || [];
              const isHostSelected = selectedNetwork?.hostId === host.id || selectedHostId === host.id;

              const networkPositions = calculateNetworkPositions(
                hostPosition,
                networks.length,
                index,
              );

              return (
                <div
                  key={host.id}
                  className="absolute"
                  style={{
                    transform: `translate(${hostPosition.x + window.innerWidth / 2}px, ${
                      hostPosition.y + window.innerHeight / 2
                    }px)`,
                  }}
                >
                  <div className="relative">
                    <HostCard
                      id={host.id}
                      hostNm={host.hostNm}
                      hostIp={host.hostIp}
                      isRemote={host.isRemote}
                      onClick={() => handleHostClick(host.id, host.hostNm, host.hostIp)}
                      themeColor={host.themeColor}
                      className={`${isHostSelected ? 'scale-105 shadow-lg' : ''} transition-all duration-300`}
                      isSelectedNetwork={isHostSelected}
                    />

                    {networks.map((network, networkIndex) => {
                      const networkPos = networkPositions[networkIndex];
                      const relativePos = {
                        x: networkPos.x - hostPosition.x,
                        y: networkPos.y - hostPosition.y,
                      };

                      return (
                        <React.Fragment key={network.id}>
                          {renderConnector(
                            0,
                            0,
                            relativePos.x,
                            relativePos.y,
                            host.themeColor.borderColor,
                          )}
                          <div
                            className="absolute"
                            style={{
                              transform: `translate(${relativePos.x}px, ${relativePos.y}px)`,
                            }}
                          >
                            <CardContainer
                              networkName={network.name}
                              networkIp={network.gateway}
                              containers={containers}
                              themeColor={host.themeColor}
                              onDelete={() => handleDeleteNetwork(host.id, network.name, network.id)}
                              onSelectNetwork={() =>
                                handleSelectNetwork(host.id, host.hostIp, network.name, network.id)
                              }
                              isSelected={
                                selectedNetwork?.hostId === host.id &&
                                selectedNetwork?.networkId === network.id
                              }
                              hostIp={host.hostIp}
                              containerNames={containerNames}
                              onContainerNameChange={(containerId, name) => {
                                setContainerNames((prev) => ({
                                  ...prev,
                                  [containerId]: name,
                                }));
                              }}
                            />
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-4">
            <CardBody>
              <p className="text-center text-default-500">호스트 데이터가 없습니다.</p>
            </CardBody>
          </Card>
        )}
      </div>
    </Draggable>
  );
};

export default CardSection;
