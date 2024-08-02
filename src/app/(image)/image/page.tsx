'use client';

import { ImageModal } from '@/components';
import { useState } from 'react';
import { SnackbarProvider } from 'notistack';

const ImagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Open Modal
        </button>
        <ImageModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </SnackbarProvider>
  );
};

export default ImagePage;
