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

interface BlueprintListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlueprintListModal = ({ isOpen, onClose }: BlueprintListModalProps) => {
  const [blueprints, setBlueprints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlueprints = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blueprint/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setBlueprints(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlueprints();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">설계도 목록</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center p-4">로딩 중...</div>
          ) : (
            <Table aria-label="Blueprint list">
              <TableHeader>
                <TableColumn>설계도 이름</TableColumn>
                <TableColumn>생성일</TableColumn>
                <TableColumn>작업</TableColumn>
              </TableHeader>
              <TableBody>
                {blueprints.map((blueprint, index) => (
                  <TableRow key={index}>
                    <TableCell>제목</TableCell>
                    <TableCell>
                      날짜
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => console.log('Load blueprint:', blueprint)}
                      >
                        불러오기
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
