'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import {
  Container,
  ImageInfo,
  ThemeColor,
  VolumeData,
  ImageToNetwork,
} from '@/types/type';
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
import ConfigurationModal from '../modal/daemon/configurationModal';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useSnackbar } from 'notistack';
import { useHostStore } from '@/store/hostStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { useContainerNameStore } from '@/store/containerNameStore';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  // containers: Container[];
  containers: any[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
  hostIp: string;
  networkUniqueId: string;
  containerId: string;
  containerName: string;
  // imageId: string;
  // imageName: string;
  // imageTag: string;
  imageInfo: [{ id: string; name: string; tag: string }];
  imageVolumesVal: {
    [networkUniqueId: string]: { [imageId: string]: VolumeData[] };
  };
  onContainerNameChange?: (name: string) => void;
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
  networkUniqueId,
  containerId,
  containerName,
  imageInfo,
  // imageId,
  // imageName,
  // imageTag,
  imageVolumesVal,
  onContainerNameChange,
}: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { setContainerName, getContainerName } = useContainerNameStore();
  const { setMappedData } = useBlueprintStore();
  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);
  const selectedHostId = selectedHostStore((state) => state.selectedHostId);
  const hosts = useHostStore((state) => state.hosts);
  const connectedBridgeIds = selectedHostStore(
    (state) => state.connectedBridgeIds
  );
  const mappedData = useBlueprintStore((state) => state.mappedData);
  const hostId = mappedData[0]?.id || selectedHostId;

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>(containerName);
  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [configData, setConfigData] = useState({
    [networkUniqueId]: {
      networkSettings: containers[0]?.networkSettings || {
        gateway: '',
        ipAddress: '',
      },
      ports: containers[0]?.ports || [],
      mounts: containers[0]?.mounts || [],
      env: containers[0]?.env || [],
      cmd: containers[0]?.cmd || [],
      imageVolumes: containers[0]?.imageVolumes || [],
    },
  });
  const [imageVolumes, setImageVolumes] = useState<{
    [networkUniqueId: string]: {
      [imageId: string]: VolumeData[];
    };
  }>(imageVolumesVal);

  // useEffect(() => {
  //   if (imageInfo) {
  //     setDroppedImages(imageInfo);
  //   }
  // }, []);

  console.log('droppedImages', droppedImages);

  useEffect(() => {
    const mappedData = hosts.map((host) => {
      const networks = connectedBridgeIds[host.id] || [];

      const mappedNetworks = networks.map((network) => {
        const networkConfigs = configData[network.uniqueId] || [];
        const networkImageVolumes =
          imageVolumes[network.uniqueId]?.[droppedImages[0]?.id] || [];

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
          containers: [],
          containerName: containerName,
          configs: networkConfigs,
          droppedImages: droppedImages,
          imageVolumes: networkImageVolumes,
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
    configData,
    droppedImages,
    imageVolumes,
    containerName,
    setMappedData,
  ]);

  const splitImageNameAndTag = (image: string, id: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { id, name, tag };
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

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string; id: string }) => {
      if (droppedImages.length > 0) {
        enqueueSnackbar(
          'Please delete the current image before adding a new one.',
          {
            variant: 'warning',
            autoHideDuration: 3000,
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
          }
        );
        return;
      }

      const newImage = splitImageNameAndTag(item.image, item.id);
      console.log('newImage', newImage);
      setDroppedImages([newImage]);

      setImageToNetwork([
        {
          id: item.id,
          name: newImage.name,
          tag: newImage.tag,
          networkName,
        },
      ]);
    },
    canDrop: () => hostIp === selectedHostIp,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const allImages =
    droppedImages.length > 0
      ? droppedImages
      : containers.map((c) => ({
          id: c.containerId,
          name: c.image.name,
          tag: c.image.tag,
        }));

  const handleDeleteImage = (imageId: string) => {
    console.log('imageId >>>>', imageId);
    // 이미지 삭제
    setDroppedImages((prev) => prev.filter((image) => image.id !== imageId));
    // imageToNetwork에서 해당 이미지 정보 삭제
    setImageToNetwork((prev) => prev.filter((entry) => entry.id !== imageId));
    // imageVolumes에서 해당 이미지의 볼륨 데이터 삭제
    setImageVolumes((prev) => {
      const updatedVolumes = { ...prev };
      delete updatedVolumes[imageId];
      return updatedVolumes;
    });
  };

  const handleOpenVolumeModal = (imageId: string) => {
    const volumes = configData[networkUniqueId]?.imageVolumes?.[imageId] || [];
    setSelectedImage(imageId);
    setSelectedVolumes(volumes);
    setIsVolumeModalOpen(true);
  };

  const handleCloseVolumeModal = () => {
    setIsVolumeModalOpen(false);
  };

  const handleAddVolume = (volumeData: VolumeData[]) => {
    setImageVolumes((prev) => ({
      ...prev,
      [networkUniqueId]: {
        ...(prev[networkUniqueId] || {}),
        [selectedImage]: volumeData,
      },
    }));
    handleCloseVolumeModal();
  };

  const handleSaveConfig = (newConfig: any) => {
    setConfigData((prevConfigData) => ({
      ...prevConfigData,
      [networkUniqueId]: newConfig,
    }));
    setIsConfigModalOpen(false);
  };
  const handleNameSubmit = () => {
    if (inputName.trim()) {
      // 스토어에 컨테이너 이름을 저장
      setContainerName(hostId, networkUniqueId, containerId, inputName);
      onContainerNameChange?.(inputName);
      setIsEditingName(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 컨테이너 이름은 최대 20자로 제한
    const value = e.target.value.slice(0, 20);
    setInputName(value);
  };

  const handleCancelEdit = () => {
    // 저장된 컨테이너 이름을 스토어에서 가져와서 설정
    const storedName = getContainerName(hostId, networkUniqueId, containerId);
    setInputName(storedName || containerName);
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
                  value={inputName}
                  onChange={handleNameChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  placeholder="컨테이너 이름 입력 (최대 20자)"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="primary"
                  onPress={handleNameSubmit}
                >
                  <Check size={16} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  onPress={handleCancelEdit}
                >
                  <XIcon size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-default-50 rounded-medium px-3 py-2">
                <span className="text-sm">
                  {inputName || '컨테이너 이름을 설정하세요'}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => setIsEditingName(true)}
                >
                  <Edit2 size={16} />
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
              <Accordion
                className="p-0 gap-2"
                itemClasses={{
                  base: 'py-0 w-full',
                  title: 'font-normal text-small',
                  trigger: 'px-2 py-2 data-[hover=true]:bg-default-100',
                  indicator: 'text-default-400',
                }}
              >
                {allImages[0].id &&
                  allImages.map((image) => (
                    <AccordionItem
                      key={image.id}
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
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              onPress={() => handleOpenVolumeModal(image.id)}
                            >
                              <Plus size={16} />
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              variant="light"
                              isIconOnly
                              onPress={() => handleDeleteImage(image.id)}
                            >
                              <CircleX size={16} />
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      {imageVolumes[networkUniqueId]?.[image.id]?.length > 0 ? (
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
                            {imageVolumes[networkUniqueId][image.id].map(
                              (vol, index) => (
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
                              )
                            )}
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
        initialConfig={configData[networkUniqueId]}
      />
    </>
  );
};

export default CardContainer;
