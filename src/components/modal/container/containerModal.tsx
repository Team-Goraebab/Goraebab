'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useImageStore } from '@/store/imageStore';
import { useVolumeStore } from '@/store/volumeStore';
import { useContainerStore } from '@/store/containerStore';
import { Button } from '@/components';

interface ContainerModalProps {
  onClose: () => void;
  onSave: (containerData: any) => void;
}

const ContainerModal = ({ onClose, onSave }: ContainerModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const images = useImageStore((state) => state.images);
  const volumes = useVolumeStore((state) => state.volumes);

  const [name, setName] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [ports, setPorts] = useState<string>('80:80,443:443');
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [selectedVolumesInfo, setSelectedVolumeInfo] = useState<any>([]);
  const [network, setNetwork] = useState<string>('bridge');
  const [tag, setTag] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedImageInfo, setSelectedImageInfo] = useState<any | null>(null);

  const handleVolumeChange = (volume: any, volumeName: string) => {
    setSelectedVolumes((prevSelected) =>
      prevSelected.includes(volumeName)
        ? prevSelected.filter((name) => name !== volumeName)
        : [...prevSelected, volumeName]
    );
    setSelectedVolumeInfo((prevSelected: any) =>
      prevSelected.some((vol: any) => vol.id === volume.id)
        ? prevSelected.filter((vol: any) => vol.id !== volume.id)
        : [...prevSelected, volume]
    );
    console.log(volume);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedImageName = event.target.value;
    setSelectedImage(selectedImageName);

    // 이미지 전체 정보 찾기 및 저장
    const selectedImageData = images.find(
      (img) => img.name === selectedImageName
    );
    setSelectedImageInfo(selectedImageData || null);

    console.log('Selected Image Info:', selectedImageData);
  };

  const handleSave = () => {
    if (!name || !selectedImage || !ip) {
      showSnackbar(
        enqueueSnackbar,
        '모든 필드를 입력해주세요.',
        'error',
        '#FF4853'
      );
      return;
    }

    const newContainer = {
      id: uuidv4(),
      name,
      ip,
      // size 수정 필요
      size: 'N/A',
      tag: selectedImageInfo?.tag || 'latest',
      active: 'active',
      status: 'running',
      network: network,
      image: selectedImageInfo,
      volume: selectedVolumesInfo,
    };

    onSave(newContainer);
    // 컨테이너 스토어에 저장
    useContainerStore.getState().addContainer(newContainer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-32">
      <div className="bg-white p-6 rounded-md shadow-lg w-2/5">
        <h2 className="text-lg font-semibold mb-4">Create Container</h2>
        <input
          type="text"
          placeholder="Container Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />

        {/* 이미지 선택 드롭다운 (단일 선택) */}
        <p className="font-semibold mb-2 mt-2">Select an Image:</p>
        <select
          value={selectedImage}
          onChange={handleImageChange}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        >
          <option value="" hidden>
            Select an Image
          </option>
          {images.map((image) => (
            <option key={image.id} value={image.name}>
              {image.name} ({image.source})
            </option>
          ))}
        </select>

        {/* 볼륨 선택 체크박스 */}
        <p className="font-semibold mb-2 mt-2">Select Volumes:</p>
        <div className="mb-4 max-h-24 overflow-y-auto border p-2 rounded">
          {volumes.length > 0 ? (
            volumes.map((volume) => (
              <div key={volume.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`volume-${volume.id}`}
                  value={volume.name}
                  checked={selectedVolumes.includes(volume.name)}
                  onChange={() => handleVolumeChange(volume, volume.name)}
                  className="mr-2"
                />
                <label htmlFor={`volume-${volume.id}`}>
                  {volume.name} ({volume.driver})
                </label>
              </div>
            ))
          ) : (
            <div>No volumes</div>
          )}
        </div>
        <input
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full mt-2"
        />
        <input
          type="text"
          placeholder="Ports (e.g., 80:80,443:443)"
          value={ports}
          onChange={(e) => setPorts(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex justify-end space-x-2 pt-8">
          <Button title={'Cancel'} onClick={onClose} color="grey" />
          <Button title={'Create'} onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default ContainerModal;
