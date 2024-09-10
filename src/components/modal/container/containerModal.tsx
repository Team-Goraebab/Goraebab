'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { showSnackbar } from '@/utils/toastUtils';
import { useImageStore } from '@/store/imageStore';
import { useVolumeStore } from '@/store/volumeStore';

interface ContainerModalProps {
  onClose: () => void;
  onSave: (containerData: any) => void;
}

const ContainerModal = ({ onClose, onSave }: ContainerModalProps) => {
  const [name, setName] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [ports, setPorts] = useState<string>('80:80,443:443');
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]); // 선택된 볼륨 저장
  const [network, setNetwork] = useState<string>('bridge');
  const [tags, setTags] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>(''); // 선택된 이미지 저장
  const { enqueueSnackbar } = useSnackbar();
  const images = useImageStore((state) => state.images); // 이미지 스토어에서 이미지 목록 가져오기
  const volumes = useVolumeStore((state) => state.volumes); // 볼륨 스토어에서 볼륨 목록 가져오기

  const handleVolumeChange = (volumeName: string) => {
    setSelectedVolumes((prevSelected) =>
      prevSelected.includes(volumeName)
        ? prevSelected.filter((name) => name !== volumeName)
        : [...prevSelected, volumeName]
    );
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

    const selectedImageData = images.find((img) => img.name === selectedImage);

    const newContainer = {
      id: uuidv4(),
      name,
      image: {
        name: selectedImage,
        tag: selectedImageData?.tags || 'latest',
        source: selectedImageData?.source || 'unknown',
      },
      ip,
      status: 'running',
      ports: ports.split(',').map((port) => port.trim()),
      volumes: selectedVolumes,
      network,
      tags: tags.split(',').map((tag) => tag.trim()),
    };

    onSave(newContainer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-32">
      <div className="bg-white p-6 rounded-md shadow-lg w-3/5">
        <h2 className="text-lg font-semibold mb-4">Add New Container</h2>
        <input
          type="text"
          placeholder="Container Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
        />
        <select
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.value)}
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
        <p className="font-semibold mb-2">Select Volumes:</p>
        <div className="mb-4 max-h-24 overflow-y-auto border p-2 rounded">
          {volumes.map((volume) => (
            <div key={volume.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`volume-${volume.id}`}
                value={volume.name}
                checked={selectedVolumes.includes(volume.name)}
                onChange={() => handleVolumeChange(volume.name)}
                className="mr-2"
              />
              <label htmlFor={`volume-${volume.id}`}>
                {volume.name} ({volume.driver})
              </label>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded w-full"
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
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Container
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContainerModal;
