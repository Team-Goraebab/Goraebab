'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tooltip,
  Accordion,
  AccordionItem,
  ScrollShadow,
  Input,
} from '@nextui-org/react';
import {
  PlusCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  HardDrive,
  InfoIcon,
  Edit2,
} from 'lucide-react';
import { Container, ThemeColor, VolumeData } from '@/types/type';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import SelectVolumeModal from '../modal/volume/selectVolumeModal';
import ConfigurationModal from '../modal/daemon/configurationModal';
import { selectedHostStore } from '@/store/seletedHostStore';
import { useSnackbar } from 'notistack';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
  hostIp: string;
  containerNames?: { [key: string]: string };
  onContainerNameChange?: (containerId: string, name: string) => void;
}

interface ImageInfo {
  id: string;
  name: string;
  tag: string;
}

interface ImageToNetwork {
  id: string;
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
                         containerNames = {},
                         onContainerNameChange,
                       }: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const selectedHostIp = selectedHostStore((state) => state.selectedHostIp);

  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [configs, setConfigs] = useState<{ [key: string]: any[] }>({});
  const [imageVolumes, setImageVolumes] = useState<{
    [imageId: string]: VolumeData[];
  }>({});
  const [editingName, setEditingName] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  const splitImageNameAndTag = (image: string, id: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { id, name, tag };
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetch(
        `/api/image/detail?name=${imageName}`,
      ).then((res) => res.json());
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

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
    setDroppedImages((prev) => prev.filter((image) => image.id !== imageId));
    setImageToNetwork((prev) => prev.filter((entry) => entry.id !== imageId));
    setImageVolumes((prev) => {
      const updatedVolumes = { ...prev };
      delete updatedVolumes[imageId];
      return updatedVolumes;
    });
  };

  const handleStartEditing = (imageId: string) => {
    setIsEditing((prev) => ({ ...prev, [imageId]: true }));
    setEditingName((prev) => ({
      ...prev,
      [imageId]: containerNames[imageId] || '',
    }));
  };

  const handleSaveName = (imageId: string) => {
    if (onContainerNameChange) {
      onContainerNameChange(imageId, editingName[imageId] || '');
    }
    setIsEditing((prev) => ({ ...prev, [imageId]: false }));
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    action();
  };

  return (
    <>
      <Card
        ref={ref}
        className={`w-[500px] transition-all duration-200 ${
          isOver ? 'bg-content2' : ''
        }`}
        style={{
          borderColor: isSelected ? themeColor.textColor : undefined,
          borderWidth: isSelected ? '2px' : undefined,
        }}
        onPress={onSelectNetwork}
        shadow="sm"
      >
        <CardHeader className="flex justify-between items-center px-6 pt-6">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={(e) => handleButtonClick(e as any, () => setIsConfigModalOpen(true))}
            >
              <HardDrive
                className="w-5 h-5"
                style={{ color: themeColor.textColor }}
              />
            </Button>
            <Chip
              className="h-8 px-3"
              style={{
                backgroundColor: themeColor.bgColor,
                color: themeColor.textColor,
                borderColor: themeColor.borderColor,
              }}
              variant="bordered"
              size="lg"
            >
              {`${networkName} : ${networkIp}`}
            </Chip>
          </div>
          {onDelete && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={(e) => handleButtonClick(e as any, onDelete)}
              className="text-danger hover:text-danger-400"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          )}
        </CardHeader>

        <CardBody className="px-6 pb-6">
          {allImages.length > 0 ? (
            <ScrollShadow className="max-h-[400px]">
              <div className="space-y-4">
                {allImages.map((image) => (
                  <Card
                    key={image.id}
                    shadow="none"
                    className="border border-content3 transition-colors hover:border-content4"
                  >
                    <CardBody className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-semibold truncate max-w-[150px]"
                              title={image.name}
                            >
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
                            <Tooltip content="이미지 정보">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onPress={(e) =>
                                  handleButtonClick(e as any, () =>
                                    handleGetInfo(image.name),
                                  )
                                }
                                className="hover:bg-default-100"
                              >
                                <InfoIcon className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="볼륨 추가">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onPress={(e) =>
                                  handleButtonClick(e as any, () => {
                                    setSelectedImage(image.id);
                                    setSelectedVolumes(imageVolumes[image.id] || []);
                                    setIsVolumeModalOpen(true);
                                  })
                                }
                                className="hover:bg-default-100"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="삭제" color="danger">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onPress={(e) =>
                                  handleButtonClick(e as any, () =>
                                    handleDeleteImage(image.id),
                                  )
                                }
                                className="hover:bg-danger-100 text-danger"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>

                        {/* Container Name Section */}
                        <div className="flex items-center gap-2">
                          {isEditing[image.id] ? (
                            <div className="flex-1">
                              <Input
                                size="sm"
                                placeholder="컨테이너 이름 입력"
                                value={editingName[image.id] || ''}
                                onChange={(e) =>
                                  setEditingName((prev) => ({
                                    ...prev,
                                    [image.id]: e.target.value,
                                  }))
                                }
                                onBlur={() => handleSaveName(image.id)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveName(image.id);
                                  }
                                }}
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-sm text-default-600">
                                {containerNames[image.id] || '컨테이너 이름 없음'}
                              </span>
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                onPress={(e) =>
                                  handleButtonClick(e as any, () =>
                                    handleStartEditing(image.id),
                                  )
                                }
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {imageVolumes[image.id]?.length > 0 && (
                          <Accordion
                            className="px-0"
                            variant="light"
                            selectionMode="multiple"
                          >
                            <AccordionItem
                              title={
                                <span className="text-small font-medium">
                                  Volumes ({imageVolumes[image.id]?.length || 0})
                                </span>
                              }
                              indicator={({ isOpen }) =>
                                isOpen ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )
                              }
                            >
                              <div className="space-y-2">
                                {imageVolumes[image.id].map((vol, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center py-1"
                                  >
                                    <span className="text-sm text-default-600 truncate max-w-[300px]">
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
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </ScrollShadow>
          ) : (
            <Card
              shadow="none"
              className="h-44 flex items-center justify-center border-2 border-dashed border-default-200 bg-default-50"
            >
              <CardBody>
                <p className="text-default-500 text-sm">
                  이미지를 드래그해서 놓으세요
                </p>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>

      <ImageDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={detailData}
      />
      <SelectVolumeModal
        open={isVolumeModalOpen}
        imageName={selectedImage}
        onClose={() => setIsVolumeModalOpen(false)}
        onSave={(volumeData) => {
          setImageVolumes((prev) => ({
            ...prev,
            [selectedImage]: volumeData,
          }));
          setIsVolumeModalOpen(false);
        }}
        initialSelectedVolumes={selectedVolumes}
      />
      <ConfigurationModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={(config) => {
          setConfigs((prev) => ({
            ...prev,
            [networkName]: [...(prev[networkName] || []), config],
          }));
          setIsConfigModalOpen(false);
        }}
      />
    </>
  );
};

export default CardContainer;
