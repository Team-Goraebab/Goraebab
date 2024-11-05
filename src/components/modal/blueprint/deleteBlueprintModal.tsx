'use client';

import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';

interface DeleteBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteBlueprintModal = ({
  isOpen,
  onClose,
  onDelete,
}: DeleteBlueprintModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>설계도 삭제</ModalHeader>
        <ModalBody>설계도를 삭제하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            취소
          </Button>
          <Button color="danger" onPress={onDelete}>
            삭제
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteBlueprintModal;
