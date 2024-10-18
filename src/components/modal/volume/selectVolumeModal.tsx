'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import ModalButton from '@/components/button/ModalButton';
import { fetchData } from '@/services/apiUtils';

interface SelectVolumeModalProps {
  open: boolean;
  imageName: string;
  onClose: () => void;
  onSave: (selectedVolumes: any[]) => void;
  initialSelectedVolumes: any[]; // 추가
}

const SelectVolumeModal = ({
  open,
  imageName,
  onClose,
  onSave,
  initialSelectedVolumes,
}: SelectVolumeModalProps) => {
  const [volumes, setVolumes] = useState<any[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  useEffect(() => {
    loadData();
    setSelectedVolumes(initialSelectedVolumes.map((v) => v.Name)); // 초기화
  }, [open]);

  const loadData = async () => {
    try {
      const volumeData = await fetchData('/api/volume/list');
      setVolumes(volumeData?.Volumes || []);
    } catch (error) {
      console.error('Failed to load volumes:', error);
    }
  };

  const handleVolumeChange = (volume: any, volumeName: string) => {
    if (selectedVolumes.includes(volumeName)) {
      setSelectedVolumes(selectedVolumes.filter((v) => v !== volumeName));
    } else {
      setSelectedVolumes([...selectedVolumes, volumeName]);
    }
  };

  const handleSave = () => {
    const selectedVolumeData = volumes.filter((v) =>
      selectedVolumes.includes(v.Name)
    );
    onSave(selectedVolumeData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{imageName} 볼륨 선택</DialogTitle>
      <DialogContent>
        <div className="mb-4">
          <div className="max-h-64 overflow-y-auto border border-gray_4 p-3 rounded-lg">
            {volumes.length > 0 ? (
              volumes.map((volume) => (
                <div key={volume.Id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`volume-${volume.Id}`}
                    value={volume.Name}
                    checked={selectedVolumes.includes(volume.Name)}
                    onChange={() => handleVolumeChange(volume, volume.Name)}
                    className="mr-2"
                  />
                  <label htmlFor={`volume-${volume.Id}`}>
                    {volume.Name} ({volume.Driver})
                  </label>
                </div>
              ))
            ) : (
              <p>No volumes available</p>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <ModalButton onClick={handleSave}>저장</ModalButton>
      </DialogActions>
    </Dialog>
  );
};

export default SelectVolumeModal;
