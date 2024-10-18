'use client';

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import {
  FaTimesCircle,
  FaInfoCircle,
  FaPencilAlt,
  FaPlusCircle,
} from 'react-icons/fa';
import { Container, ThemeColor, VolumeData } from '@/types/type';
import ImageDetailModal from '@/components/modal/image/imageDetailModal';
import ContainerNameModal from '../modal/container/containerNameModal';
import SelectVolumeModal from '../modal/volume/selectVolumeModal';

export interface CardContainerProps {
  networkName: string;
  networkIp: string;
  containers: Container[];
  themeColor: ThemeColor;
  onDelete?: () => void;
  onSelectNetwork?: () => void;
  isSelected?: boolean;
}

interface ImageInfo {
  name: string;
  tag: string;
}

interface ImageToNetwork {
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
}: CardContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [droppedImages, setDroppedImages] = useState<ImageInfo[]>([]);
  const [imageToNetwork, setImageToNetwork] = useState<ImageToNetwork[]>([]);
  const [detailData, setDetailData] = useState<any>(null);
  const [containerName, setContainerName] = useState<string>('container name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVolumes, setSelectedVolumes] = useState<VolumeData[]>([]);
  const [imageVolumes, setImageVolumes] = useState<{
    [network: string]: { [imageKey: string]: VolumeData[] };
  }>({});

  console.log('imageToNetwork >>>', imageToNetwork);
  console.log('imageVolumes >>>', imageVolumes);

  const splitImageNameAndTag = (image: string): ImageInfo => {
    const [name, tag] = image.split(':');
    return { name, tag };
  };

  const handleGetInfo = async (imageName: string) => {
    try {
      const imageDetail = await fetch(
        `/api/image/detail?name=${imageName}`
      ).then((res) => res.json());
      setDetailData(imageDetail);
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: 'IMAGE_CARD',
    drop: (item: { image: string }) => {
      const imageInfo = splitImageNameAndTag(item.image);
      setDroppedImages((prev) => [...prev, imageInfo]);
      setImageToNetwork((prev) => [...prev, { ...imageInfo, networkName }]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const handleDeleteImage = (index: number) => {
    const imageToDelete = droppedImages[index];
    const imageKey = `${imageToDelete.name}:${imageToDelete.tag}`;

    // 이미지 삭제
    setDroppedImages((prev) => prev.filter((_, i) => i !== index));

    // imageToNetwork에서 해당 이미지 정보 삭제
    setImageToNetwork((prev) =>
      prev.filter(
        (entry) =>
          !(
            entry.name === imageToDelete.name &&
            entry.tag === imageToDelete.tag &&
            entry.networkName === networkName
          )
      )
    );

    // imageVolumes에서 해당 이미지의 볼륨 데이터 삭제
    setImageVolumes((prev) => {
      const updatedVolumes = { ...prev };
      if (
        updatedVolumes[networkName] &&
        updatedVolumes[networkName][imageKey]
      ) {
        delete updatedVolumes[networkName][imageKey];
        // 만약 해당 네트워크에 더 이상 볼륨 정보가 없다면 네트워크 키도 삭제
        if (Object.keys(updatedVolumes[networkName]).length === 0) {
          delete updatedVolumes[networkName];
        }
      }
      return updatedVolumes;
    });
  };

  const allImages = [
    ...containers.map((c) => splitImageNameAndTag(c.image.name)),
    ...droppedImages,
  ];

  const handleOpenNameModal = () => {
    setIsNameModalOpen(true);
  };

  const handleSaveName = (newName: string) => {
    setContainerName(newName);
    setIsNameModalOpen(false);
  };

  const handleOpenVolumeModal = (imageName: string) => {
    setSelectedImage(imageName);
    setImageVolumes((prev) => ({
      ...prev,
      [networkName]: {
        ...prev[networkName],
        [imageName]: prev[networkName]?.[imageName] || [],
      },
    }));
    setSelectedVolumes(imageVolumes[networkName]?.[imageName] || []);
    setIsVolumeModalOpen(true);
  };

  const handleCloseVolumeModal = () => {
    setIsVolumeModalOpen(false);
  };

  const handleAddVolume = (volumeData: VolumeData[]) => {
    setImageVolumes((prev) => ({
      ...prev,
      [networkName]: {
        ...prev[networkName],
        [selectedImage]: volumeData,
      },
    }));
    handleCloseVolumeModal();
  };

  return (
    <>
      <div
        className={`absolute flex items-center text-xs font-semibold border-2 h-6 px-3 py-4 rounded-t-lg content-center`}
        style={{
          top: '-2.14rem',
          left: '1.25rem',
          zIndex: '10',
          borderColor: `${themeColor.borderColor}`,
          color: `${themeColor.textColor}`,
          backgroundColor: `${themeColor.bgColor}`,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenNameModal();
          }}
        >
          <FaPencilAlt
            className="w-4 h-4 mr-1"
            style={{ color: themeColor.borderColor }}
          />
        </button>
        {containerName}
      </div>
      <div
        ref={ref}
        className={`relative flex flex-col items-center p-[10px] border bg-white rounded-lg shadow-lg w-[450px] transition-colors duration-200 cursor-pointer ${
          isOver ? 'bg-grey_1' : ''
        }`}
        style={{
          borderColor: isSelected ? themeColor.textColor : '',
          borderWidth: isSelected ? '2px' : '',
        }}
        onClick={onSelectNetwork}
      >
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="absolute top-2 right-2 hover:text-gray-500 transition-colors duration-200 hover:scale-105"
          >
            <FaTimesCircle
              className="w-5 h-5"
              style={{ color: themeColor.borderColor }}
            />
          </button>
        )}

        <div
          className="w-full text-center text-blue_6 border-2 p-2 rounded-md mb-3 text-sm font-semibold"
          style={{
            borderColor: `${themeColor.borderColor}`,
            backgroundColor: `${themeColor.bgColor}`,
            color: `${themeColor.textColor}`,
          }}
        >
          {`${networkName} : ${networkIp}`}
        </div>
        <div className="w-full max-h-36 scrollbar-hide overflow-y-auto">
          {allImages.length > 0 ? (
            <div className="w-full max-h-36 scrollbar-hide overflow-y-auto">
              {allImages.map((image, index) => {
                const imageKey = `${image.name}:${image.tag}`;
                return (
                  <div
                    key={index}
                    className="flex flex-col p-4 mb-2 rounded-md bg-black_0 hover:bg-grey_1 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{image.name}</span>
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            borderColor: `${themeColor.borderColor}`,
                            backgroundColor: `${themeColor.bgColor}`,
                            color: `${themeColor.textColor}`,
                          }}
                        >
                          {image.tag}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-grey_4 hover:text-grey_6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGetInfo(imageKey);
                          }}
                        >
                          <FaInfoCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="text-yellow_5 hover:text-yellow_6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenVolumeModal(imageKey);
                          }}
                        >
                          <FaPlusCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red_5 hover:text-red_6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(index);
                          }}
                        >
                          <FaTimesCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {imageVolumes[networkName]?.[imageKey] && (
                      <div className="mt-2 text-xs text-gray-4">
                        <details>
                          <summary
                            className="cursor-pointer"
                            style={{
                              color: `${themeColor.textColor}`,
                            }}
                          >
                            Volumes (
                            {imageVolumes[networkName][imageKey].length})
                          </summary>
                          <ul className="ml-4 mt-1">
                            {imageVolumes[networkName][imageKey].map(
                              (vol, volIndex) => (
                                <li key={volIndex}>
                                  <span
                                    className="inline-block max-w-[320px] truncate text-grey_6"
                                    title={vol.Name.length > 80 ? vol.Name : ''}
                                    style={{ cursor: 'default' }}
                                  >
                                    {vol.Name.length > 80
                                      ? `${vol.Name.slice(0, 80)}...`
                                      : vol.Name}
                                  </span>
                                  &nbsp;({vol.Driver})
                                </li>
                              )
                            )}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-36 text-center text-grey_7 p-2 text-sm">
              이미지를 드래그해서 놓으세요
            </div>
          )}
        </div>
      </div>
      <ContainerNameModal
        open={isNameModalOpen}
        containerName={containerName}
        onClose={() => setIsNameModalOpen(false)}
        onSave={handleSaveName}
        onChange={(name) => setContainerName(name)}
      />
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
    </>
  );
};

export default CardContainer;
