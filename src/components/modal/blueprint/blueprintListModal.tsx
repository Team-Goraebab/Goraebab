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
import { Host, Mount, Port, Volume } from '@/types/type';
import { colorsOption } from '@/data/color';
import { TEST_DATA } from '@/data/mock';
import { getRandomThemeColor } from '@/utils/randomTemeColor';
import { selectedHostStore } from '@/store/seletedHostStore';

interface Blueprint {
  blueprintId: number;
  name: string;
  data: {
    host: {
      name: string;
      isRemote: boolean;
      ip: string;
      network: Array<any>;
      volume: Array<any>;
    }[];
  };
  isRemote: boolean;
  dateCreated: string;
  dateUpdated: string;
}

interface BlueprintListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const BlueprintListModal = ({ isOpen, onClose }: BlueprintListModalProps) => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLoadBlueprint = (blueprint: Blueprint) => {
    // console.log('Loaded blueprint:', blueprint);

    blueprint.data.host.forEach((hostData) => {
      const formattedHost: Host = {
        id: generateId(),
        hostNm: hostData.name,
        hostIp: hostData.ip,
        status: true,
        isRemote: hostData.isRemote,
        themeColor: getRandomThemeColor(colorsOption),
        networks: hostData.network.map((network) => ({
          id: generateId(),
          name: network.name,
          ip: network.ip,
          hostId: hostData.ip,
          networkUniqueId: network.name,
          driver: network.driver,
          subnet: network.ipam.config[0]?.subnet || '',
          containers: network.containers.map((container: any) => ({
            containerName: container.containerName,
            image: {
              imageId: container.image.imageId,
              name: container.image.name,
              tag: container.image.tag,
            },
            networkSettings: {
              gateway: container.networkSettings.gateway || '',
              ipAddress: container.networkSettings.ipAddress || '',
            },
            ports: container.ports.map((port: any) => ({
              privatePort: port.privatePort,
              publicPort: port.publicPort,
            })),
            mounts: container.mounts.map((mount: any) => ({
              type: mount.type,
              name: mount.name,
              source: mount.source,
              destination: mount.destination,
              driver: mount.driver,
              alias: mount.alias,
              mode: mount.mode,
            })),
            env: container.env,
            cmd: container.cmd,
          })),
          imageVolumes: network.volume,
        })),
      };

      const formattedMappingHost = {
        id: generateId(),
        hostNm: hostData.name,
        hostIp: hostData.ip,
        status: true,
        isRemote: hostData.isRemote,
        themeColor: getRandomThemeColor(colorsOption),
        networks: hostData.network.map((network) => ({
          id: generateId(),
          name: network.name,
          ip: network.ip, // 이 부분은 필요에 따라 수정하세요.
          hostId: hostData.ip,
          networkUniqueId: network.name,
          driver: network.driver,
          subnet: network.ipam.config[0]?.subnet || '',
          containerName: network.containers[0]?.containerName || undefined, // 첫 번째 컨테이너 이름 또는 undefined
          configs: network.containers.map((container: any) => ({
            containerName: container.containerName,
            image: {
              imageId: container.image.imageId,
              name: container.image.name,
              tag: container.image.tag,
            },
            networkSettings: {
              gateway: container.networkSettings.gateway || '',
              ipAddress: container.networkSettings.ipAddress || '',
            },
            ports: container.ports.map((port: any) => ({
              privatePort: port.privatePort,
              publicPort: port.publicPort,
            })),
            mounts: container.mounts.map((mount: any) => ({
              type: mount.type,
              name: mount.name,
              source: mount.source,
              destination: mount.destination,
              driver: mount.driver,
              mode: mount.mode,
            })),
          })),
          imageVolumes:
            network.volume && network.volume.length > 0
              ? network.volume.map((volume: any) => ({
                  id: generateId(), // 필요에 따라 ID 생성
                  name: volume.name,
                  driver: volume.driver,
                  mountPoint: '', // 필요에 따라 설정
                  capacity: '', // 필요에 따라 설정
                  status: '', // 필요에 따라 설정
                }))
              : [], // 볼륨이 없을 경우 빈 배열 설정
        })),
      };

      // formattedMappingHost.networks.forEach((network) => {
      //   network.hostId = formattedMappingHost.id;
      // });

      // 호스트 ID를 네트워크 정보에 설정
      formattedHost.networks.forEach((network) => {
        console.log(network.networkSettings?.gateway);
        network.hostId = formattedHost.id;
        // 연결된 브릿지 정보 추가
        addConnectedBridgeId(formattedHost.id, {
          id: generateId(),
          uniqueId: network.name,
          name: network.name,
          gateway: network.networkSettings?.gateway || '',
          driver: network.driver,
          subnet: network.subnet,
          scope: '',
        });
      });
      console.log('formattedMappingHost', formattedMappingHost);
      addHost(formattedHost);
      // setMappedData(blueprint.data.host);
      setMappedData([formattedMappingHost]);
    });
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
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
