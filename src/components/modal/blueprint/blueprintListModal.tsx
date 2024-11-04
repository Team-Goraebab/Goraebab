'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@nextui-org/react';
import axios from 'axios';
import { useBlueprintStore } from '@/store/blueprintStore';
import { useHostStore } from '@/store/hostStore';
import { Host } from '@/types/type';
import { colorsOption } from '@/data/color';
import { TEST_DATA } from '@/data/mock';
import { getRandomThemeColor } from '@/utils/randomTemeColor';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useContainerNameStore } from '@/store/containerNameStore';
import { generateId } from '@/utils/randomId';

// interface Blueprint {
//   blueprintId: number;
//   name: string;
//   data: {
//     host: {
//       name: string;
//       id: string;
//       isRemote: boolean;
//       ip: string;
//       network: Array<any>;
//       volume: Array<any>;
//     }[];
//   };
//   isRemote: boolean;
//   dateCreated: string;
//   dateUpdated: string;
// }

interface BlueprintListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const BlueprintListModal = ({ isOpen, onClose }: BlueprintListModalProps) => {
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setContainerName, getContainerName } = useContainerNameStore();
  const { mappedData, setMappedData } = useBlueprintStore();
  const { addHost } = useHostStore();
  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  const fetchBlueprints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/blueprint/list`);
      setBlueprints(TEST_DATA);
      // setBlueprints(response.data || []);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlueprints();
    }
  }, [isOpen]);

  const handleLoadBlueprint = (blueprint: any) => {
    blueprint.data.host.forEach((hostData: any) => {
      const formattedHost: Host = {
        id: hostData.id,
        hostNm: hostData.name,
        hostIp: hostData.ip,
        status: true,
        isRemote: hostData.isRemote,
        themeColor: getRandomThemeColor(colorsOption),
        networks: hostData.network.map((network: any) => ({
          id: network.id,
          name: network.name,
          ip: network.ipam.config[0]?.subnet || '',
          hostId: hostData.id,
          networkUniqueId: network.id,
          driver: network.driver,
          subnet: network.ipam.config[0]?.subnet || '',
          containers: network.containers.map((container: any) => ({
            containerName: container.containerName,
            image: {
              imageId: container.image.imageId,
              name: container.image.name,
              tag: container.image.tag,
            },
            networkSettings: container.networkSettings,
            ports: container.ports,
            mounts: container.mounts,
            env: container.env,
            cmd: container.cmd,
          })),
          imageVolumes: network.volume || [],
        })),
      };

      hostData.network.forEach((network: any) => {
        network.containers.forEach((container: any) => {
          const hostId = hostData.id;
          const networkId = network.id;
          const containerId = container.containerId;
          const containerName = container.containerName;

          setContainerName(hostId, networkId, containerId, containerName);

          addConnectedBridgeId(hostId, {
            id: generateId(),
            uniqueId: networkId,
            name: network.name,
            gateway: container.networkSettings.gateway || '',
            driver: network.driver,
            subnet: network.ipam.config[0]?.subnet || '',
            scope: '',
            containers: network.containers.map((c: any) => ({
              containerName: c.containerName,
              containerId: c.containerId,
            })),
          });
        });
      });

      addHost(formattedHost);
      setMappedData([formattedHost]);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent className="pb-3">
        <ModalHeader className="flex flex-col gap-1">설계도 목록</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              로딩 중...
            </div>
          ) : blueprints.length === 0 ? (
            <div className="flex justify-center items-center p-4">
              데이터가 없습니다.
            </div>
          ) : (
            <Table aria-label="Blueprint list">
              <TableHeader>
                <TableColumn>설계도 이름</TableColumn>
                <TableColumn>생성일</TableColumn>
                <TableColumn>로컬/리모트</TableColumn>
                <TableColumn>작업</TableColumn>
              </TableHeader>
              <TableBody>
                {blueprints.map((blueprint) => (
                  <TableRow key={blueprint.blueprintId}>
                    <TableCell>{blueprint.name}</TableCell>
                    <TableCell>{formatDate(blueprint.dateCreated)}</TableCell>
                    <TableCell>
                      {blueprint.data.host[0]?.isRemote ? 'Local' : 'Remote'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleLoadBlueprint(blueprint)}
                      >
                        불러오기
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BlueprintListModal;
