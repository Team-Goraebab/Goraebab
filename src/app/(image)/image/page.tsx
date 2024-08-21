'use client';

import { Card, ImageModal } from '@/components';
import { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { selectedHostStore } from '@/store/seletedHostStore';

const ImagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<
    {
      id: string;
      name: string;
      tags: string;
      file: File;
      size: string;
      status: string;
    }[]
  >([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 상태 배열
  const statuses = ['primary', 'secondary', 'accent', 'success'];

  // 랜덤 상태 선택 함수
  const getRandomStatus = () => {
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  };

  const handleSave = (
    id: string,
    name: string,
    tags: string,
    file: File,
    size: string
  ) => {
    // 테스트용 랜덤 상태 생성
    const randomStatus = getRandomStatus();
    setCards([...cards, { id, name, tags, file, size, status: randomStatus }]);
  };
  const { selectedHostId } = selectedHostStore();

  return <></>;
};

export default ImagePage;
