'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Checkbox,
  Button,
} from '@nextui-org/react';

interface SaveBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  blueprintName: string;
  setBlueprintName: (name: string) => void;
  isDockerRemote: boolean;
  setIsDockerRemote: (value: boolean) => void;
  remoteUrl: string;
  setRemoteUrl: (url: string) => void;
}

const SaveBlueprintModal = ({
  isOpen,
  onClose,
  onSave,
  blueprintName,
  setBlueprintName,
  isDockerRemote,
  setIsDockerRemote,
  remoteUrl,
  setRemoteUrl,
}: SaveBlueprintModalProps) => {
  const isSaveDisabled = blueprintName.trim() === '';

  const handleSave = () => {
    if (!isSaveDisabled) {
      onSave();
      setBlueprintName('');
      onClose();
    }
  };

  const handleClose = () => {
    setBlueprintName('');
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 20) {
      setBlueprintName(newValue);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>설계도 저장</ModalHeader>
        <ModalBody>
          <Input
            autoFocus
            placeholder="설계도 이름을 입력하세요 (최대 20자)"
            value={blueprintName}
            onChange={handleNameChange}
          />
          <Checkbox
            isSelected={isDockerRemote}
            onValueChange={setIsDockerRemote}
          >
            Docker Remote
          </Checkbox>
          {isDockerRemote && (
            <Input
              placeholder="Remote URL을 입력하세요"
              value={remoteUrl}
              onChange={(e) => setRemoteUrl(e.target.value)}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={handleClose}>
            취소
          </Button>
          <Button
            color="primary"
            onPress={handleSave}
            disabled={isSaveDisabled}
            style={{
              backgroundColor: isSaveDisabled ? '#D3D3D3' : '',
              cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveBlueprintModal;
