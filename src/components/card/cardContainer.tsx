'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { Container, ImageInfo, ThemeColor, VolumeData } from '@/types/type';
import {
  Card,
  CardBody,
  Button,
  Chip,
  Accordion,
  AccordionItem,
  ScrollShadow,
  Input,
  Divider,
  CardFooter,
} from '@nextui-org/react';
import {
  CircleX,
  Info,
  Plus,
  Settings,
  Edit2,
  Check,
  XIcon,
  HardDrive,
  Network,
  ContainerIcon,
  ImageIcon,
  FolderOpen,
} from 'lucide-react';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import SelectVolumeModal from '../modal/volume/selectVolumeModal';
import ConfigurationModal, {
  ConfigurationData,
} from '../modal/daemon/configurationModal';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useSnackbar } from 'notistack';
import { useHostStore } from '@/store/hostStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { containerNamePattern } from '@/utils/patternUtils';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
  hostIp: string;
  containerId: string;
  containerName: string;
  onContainerNameChange?: (containerId: string, name: string) => void;
  configsVal: any[];
  initialDroppedImages: any[];
  initialImagesVolumes: any[];
}

interface ImageToNetwork {
  imageId: string;
  name: string;
  tag: string;
  networkName: string;
}

const CardContainer = ({
  networkName,
  networkIp,
  containers,
  themeColor,
  onDelete,
  onSelectNetwork,
  isSelected,
  hostIp,
  containerId,
  containerName,
  onContainerNameChange,
  configsVal,
  initialDroppedImages,
  initialImagesVolumes,
}: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const { setMappedData } = useBlueprintStore();
  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);
  const hosts = useHostStore((state) => state.hosts);
  const connectedBridgeIds = selectedHostStore(
    (state) => state.connectedBridgeIds
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempContainerName, setTempContainerName] = useState(containerName);
  const [droppedImages, setDroppedImages] =
    useState<ImageInfo[]>(initialDroppedImages);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [configs, setConfigs] = useState<ConfigurationData[]>(
    configsVal.map((c) => ({
      networkSettings: {
        gateway: c.networkSettings.gateway || '192.168.1.1',
        ipAddress: c.networkSettings.ipAddress || '192.168.1.100',
      },
      ports: {
        privatePort: c.ports.privatePort || '80',
        publicPort: c.ports.publicPort || '8080',
      },
      mounts: c.mounts || [],
      env: c.env || [],
      cmd: c.cmd || [],
    }))
  );
  const [imageVolumes, setImageVolumes] =
    useState<VolumeData[]>(initialImagesVolumes);

  const initialConfig = configs.length > 0 ? configs[0] : undefined;

  useEffect(() => {
    const mappedData = hosts.map((host) => {
      const networks = connectedBridgeIds[host.id] || [];
      const mappedNetworks = networks.map((network) => {
        return {
          id: network.id,
          name: network.name,
          gateway: network.gateway,
          driver: network.driver,
          subnet: network.subnet,
          scope: network.scope,
          hostId: host.id,
          networkUniqueId: network.uniqueId,
          ip: network.gateway,
          containers: network.containers
            ? network.containers.map((container) => ({
                containerName: container.containerName,
                containerId: container.containerId,
                image: {
                  imageId: container.image?.imageId || '',
                  name: container.image?.name || '',
                  tag: container.image?.tag || '',
                },
                networkSettings: container.networkSettings || {},
                ports: container.ports || [],
                mounts: container.mounts || [],
                env: container.env || [],
                cmd: container.cmd || [],
              }))
            : [],
          configs: configs || [],
          droppedImages: droppedImages || [],
          imageVolumes: imageVolumes || [],
        };
      });

      return {
        ...host,
        networks: mappedNetworks,
      };
    });

    setMappedData(mappedData);
  }, [
    hosts,
    connectedBridgeIds,
    configs,
    droppedImages,
    imageVolumes,
    containerName,
    setMappedData,
  ]);

  const splitImageNameAndTag = (image: string, imageId: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { imageId, name, tag };
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetch(
        `/api/image/detail?name=${imageName}`
      ).then((res) => res.json());
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      throw error;
    }
  };

  const isDefaultImage = (image: ImageInfo) => {
    return !image.imageId && !image.name && !image.tag;
  };
  // 이미지 유효성 상태
  const [imageValid, setImageValid] = useState<boolean>(false);

  // droppedImages 배열을 업데이트할 때마다 이미지의 유효성을 확인
  useEffect(() => {
    // 이미지가 유효하지 않다면 droppedImages를 빈 배열로 설정
    if (droppedImages.length > 0 && isDefaultImage(droppedImages[0])) {
      setImageValid(false);
      setDroppedImages([]);
    } else {
      setImageValid(true);
    }
  }, [droppedImages]);

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string; id: string }) => {
      if (droppedImages.length > 0) {
        enqueueSnackbar('이미지는 하나만 추가할 수 있습니다.', {
          variant: 'warning',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
        return;
      }

      const imageInfo = splitImageNameAndTag(item.image, item.id);
      setDroppedImages((prev) => [...prev, imageInfo]);
      setImageToNetwork((prev) => [...prev, { ...imageInfo, networkName }]);
    },
    canDrop: () => hostIp === selectedHostIp,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const allImages = [
    ...containers.map((c) => splitImageNameAndTag(c.image.name, c.id)),
    ...droppedImages,
  ];

  const handleDeleteImage = (imageId: string) => {
    // 이미지 삭제
    setDroppedImages((prev) =>
      prev.filter((image) => image.imageId !== imageId)
    );
    // imageToNetwork에서 해당 이미지 정보 삭제
    setImageToNetwork((prev) =>
      prev.filter((entry) => entry.imageId !== imageId)
    );

    // 이미지 삭제 후 드롭 가능 상태로 전환
    setImageValid(false);
  };

  const handleOpenVolumeModal = (currentContainerId: string) => {
    setSelectedImage(currentContainerId);
    setSelectedVolumes(imageVolumes || []);
    setIsVolumeModalOpen(true);
  };

  const handleCloseVolumeModal = () => {
    setIsVolumeModalOpen(false);
  };

  const handleAddVolume = (volumeData: VolumeData[]) => {
    setImageVolumes(volumeData);
    handleCloseVolumeModal();
  };

  const handleSaveConfig = (config: ConfigurationData) => {
    setConfigs((prevConfigs) => [...prevConfigs, config]);
    setIsConfigModalOpen(false);
  };

  const handleNameSubmit = () => {
    if (tempContainerName.trim().length > 255) {
      enqueueSnackbar('컨테이너 이름은 최대 255자까지 가능합니다.', {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      return;
    }

    if (!containerNamePattern.test(tempContainerName.trim())) {
      enqueueSnackbar(
        '컨테이너 이름은 소문자, 숫자, 밑줄, 마침표, 하이픈만 사용할 수 있습니다.',
        {
          variant: 'error',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        }
      );
      return;
    }

    if (tempContainerName.trim()) {
      if (onContainerNameChange) {
        onContainerNameChange(containerId, tempContainerName);
      }
      setIsEditingName(false);
    }
  };

  useEffect(() => {
    setTempContainerName(containerName);
  }, [containerName]);

  const handleCancelEdit = () => {
    setTempContainerName(containerName);
    setIsEditingName(false);
  };

  return (
    <>
      <Card
        ref={ref}
        shadow={'none'}
        onPress={onSelectNetwork}
        className={`w-[500px] border-gray_2 border`}
        classNames={{
          base: isSelected
            ? `border-2 border-${themeColor.textColor} transition-all duration-200`
            : 'transition-all duration-200',
        }}
      >
        <CardBody className="gap-3 p-4">
          <div className="flex justify-between items-center">
            <Chip
              variant="flat"
              classNames={{
                base: 'bg-gradient-to-br rounded-md',
                content: 'text-sm font-semibold px-3 py-2',
              }}
              style={{
                backgroundColor: themeColor.bgColor,
                color: themeColor.textColor,
              }}
              startContent={<Network size={14} className="ml-2" />}
            >
              {networkName} : {networkIp}
            </Chip>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => setIsConfigModalOpen(true)}
              startContent={<Settings size={16} />}
            >
              설정
            </Button>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2 mb-1">
              <ContainerIcon size={16} className="text-default-500" />
              <span className="text-small text-default-500">컨테이너 이름</span>
            </div>
            {isEditingName ? (
              <div className="flex gap-2 items-center">
                <Input
                  autoFocus
                  size="sm"
                  value={tempContainerName}
                  onChange={(e) => setTempContainerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  placeholder="컨테이너 이름 입력 (최대 255자)"
                  classNames={{
                    input: 'h-8 text-small',
                    inputWrapper: 'h-8 min-h-unit-8 py-0',
                  }}
                  startContent={
                    <Edit2 size={14} className="text-default-400" />
                  }
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={handleNameSubmit}
                >
                  <Check size={16} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={handleCancelEdit}
                >
                  <XIcon size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-default-50 rounded-medium px-3 py-2">
                <span className="text-sm text-default-700">
                  {containerName || '컨테이너 이름을 설정하세요'}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setIsEditingName(true)}
                >
                  <Edit2 size={16} className="text-default-400" />
                </Button>
              </div>
            )}
          </div>

          <Divider />

          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive size={16} className="text-default-500" />
                <span className="text-small text-default-500">이미지</span>
              </div>
            </div>

            <ScrollShadow className="h-32">
              {allImages.length > 0 ? (
                <Accordion
                  className="p-0 gap-2"
                  itemClasses={{
                    base: 'py-0 w-full',
                    title: 'font-normal text-small',
                    trigger: 'px-2 py-2 data-[hover=true]:bg-default-100',
                    indicator: 'text-default-400',
                  }}
                >
                  {allImages.map((image) => (
                    <AccordionItem
                      key={image.imageId}
                      aria-label={image.name}
                      title={
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <ImageIcon size={16} className="text-default-500" />
                            <span className="font-medium truncate max-w-[180px]">
                              {image.name}
                            </span>
                            <Chip
                              size="sm"
                              variant="flat"
                              style={{
                                backgroundColor: themeColor.bgColor,
                                color: themeColor.textColor,
                              }}
                            >
                              {image.tag}
                            </Chip>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => handleGetInfo(image.name)}
                            >
                              <Info size={16} />
                            </Button>
                            j
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() =>
                                handleOpenVolumeModal(image.imageId)
                              }
                            >
                              <Plus size={16} />
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              isIconOnly
                              onPress={() => handleDeleteImage(image.imageId)}
                            >
                              <CircleX size={16} />
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      {imageVolumes?.length > 0 ? (
                        <div className="px-2 pb-2">
                          <div className="flex items-center gap-2 mb-2">
                            <FolderOpen
                              size={14}
                              className="text-default-500"
                            />
                            <span className="text-small text-default-500">
                              연결된 볼륨
                            </span>
                          </div>
                          <div className="space-y-2">
                            {imageVolumes.map((vol, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-default-50 rounded-medium"
                              >
                                <span className="text-sm truncate max-w-[300px] text-default-700">
                                  {vol.Name}
                                </span>
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  className="bg-default-100"
                                >
                                  {vol.Driver}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="px-2 pb-2">
                          <div className="flex items-center justify-center p-3 bg-default-50 rounded-medium">
                            <span className="text-sm text-default-400">
                              연결된 볼륨이 없습니다
                            </span>
                          </div>
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed rounded-large p-4 gap-2">
                  <ImageIcon size={24} className="text-default-300" />
                  <span className="text-sm text-default-400">
                    이미지를 드래그하여 추가하세요
                  </span>
                </div>
              )}
            </ScrollShadow>
          </div>
        </CardBody>

        {onDelete && (
          <CardFooter className="justify-end px-4 py-2 bg-default-50">
            <Button
              size="sm"
              color="danger"
              variant="light"
              startContent={<CircleX size={18} />}
              onPress={onDelete}
            >
              삭제
            </Button>
          </CardFooter>
        )}
      </Card>

      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <SelectVolumeModal
        open={isVolumeModalOpen}
        imageName={selectedImage}
        onClose={handleCloseVolumeModal}
        onSave={handleAddVolume}
        initialSelectedVolumes={selectedVolumes}
      />
      <ConfigurationModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={initialConfig}
      />
    </>
  );
};

export default CardContainer;
