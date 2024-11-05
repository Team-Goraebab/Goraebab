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
import { showSnackbar } from '@/utils/toastUtils';
import { useBlueprintStore } from '@/store/blueprintStore';
import { useHostStore } from '@/store/hostStore';
import { Host } from '@/types/type';
import { colorsOption } from '@/data/color';
import { TEST_DATA } from '@/data/mock';
import { getRandomThemeColor } from '@/utils/randomTemeColor';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useContainerNameStore } from '@/store/containerNameStore';
import { generateId } from '@/utils/randomId';
import { useSnackbar } from 'notistack';
import { deleteBlueprint } from '@/services/blueprint/api';

interface BlueprintListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

const BlueprintListModal = ({ isOpen, onClose }: BlueprintListModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { setMappedData } = useBlueprintStore();
  const { addHost, hosts, isHostExist } = useHostStore();
  const addConnectedBridgeId = selectedHostStore(
    (state) => state.addConnectedBridgeId
  );

  const fetchBlueprints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/blueprint/list`);
      // setBlueprints(TEST_DATA);
      setBlueprints(response.data || []);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlueprint = async (
    blueprintId: string,
    blueprintName: string
  ) => {
    try {
      await deleteBlueprint(blueprintId);
      showSnackbar(
        enqueueSnackbar,
        `${blueprintName} 설계도를 삭제했습니다.`,
        'success',
        '#4CAF50'
      );
      setBlueprints((prev) =>
        prev.filter((bp) => bp.blueprintId !== blueprintId)
      );
    } catch (error) {
      // console.error('Error deleting blueprint:', error);
      showSnackbar(enqueueSnackbar, '삭제 실패했습니다.', 'error', '#d32f2f');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlueprints();
    }
  }, [isOpen]);

  const handleLoadBlueprint = (blueprint: any) => {
    if (hosts.length >= 5) {
      showSnackbar(
        enqueueSnackbar,
        '호스트는 최대 5개까지만 추가할 수 있습니다.',
        'error',
        '#d32f2f'
      );
      return;
    }

    const isDuplicate = blueprint.data.host.some((hostData: any) =>
      isHostExist(hostData.id)
    );

    if (isDuplicate) {
      showSnackbar(
        enqueueSnackbar,
        '이미 불러온 설계도입니다.',
        'error',
        '#d32f2f'
      );
      return;
    }

    blueprint.data.host.forEach((hostData: any) => {
      const formattedHost: Host = {
        id: hostData.id,
        hostNm: hostData.name,
        hostIp: hostData.ip,
        status: true,
        isRemote: hostData.isRemote,
        themeColor: getRandomThemeColor(colorsOption),
        networks: [],
      };

      hostData.network.forEach((network: any) => {
        network.containers.forEach((container: any) => {
          const networkData = {
            id: network.id,
            name: network.name,
            ip: network.ipam.config[0]?.subnet || '',
            hostId: hostData.id,
            networkUniqueId: network.id,
            driver: network.driver,
            subnet: network.ipam.config[0]?.subnet || '',
            containers: [
              {
                containerName: container.containerName,
                containerId: container.containerId,
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
                imageVolumes: hostData.volume || [],
              },
            ],
          };

          formattedHost.networks.push(networkData);

          const networkId = generateId('networks-');
          addConnectedBridgeId(hostData.id, {
            id: network.id,
            uniqueId: networkId,
            name: network.name,
            gateway: container.networkSettings.gateway || '',
            driver: network.driver || '',
            subnet: network.ipam.config[0]?.subnet || '',
            scope: '',
            containers: [
              {
                containerName: container.containerName,
                containerId: container.containerId,
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
                imageVolumes: hostData.volume || [],
              },
            ],
          });
        });
      });

      addHost(formattedHost);
      setMappedData([formattedHost]);
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent className="p-4" style={{ overflow: 'hidden' }}>
        <ModalHeader className="flex flex-col gap-1">설계도 목록</ModalHeader>
        <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
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
                    <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {blueprint.name}
                    </TableCell>
                    <TableCell>{formatDate(blueprint.dateCreated)}</TableCell>
                    <TableCell>
                      {blueprint.data.host[0]?.isRemote ? 'Remote' : 'Local'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleLoadBlueprint(blueprint)}
                        className="mr-3"
                      >
                        불러오기
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() =>
                          handleDeleteBlueprint(
                            blueprint.blueprintId,
                            blueprint.name
                          )
                        }
                      >
                        삭제
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
