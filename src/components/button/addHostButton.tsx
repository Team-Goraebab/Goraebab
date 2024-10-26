'use client';

import React, { useState } from 'react';
import HostModal from '../modal/host/hostModal';
import { HiOutlineHome, HiPlus } from 'react-icons/hi';

const AddHostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-center items-center z-50 relative h-[42px] rounded-lg">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-white bg-blue_6 hover:from-blue-600 hover:to-blue-800 text-center rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
        >
          <div className="flex gap-1 items-center">
            <HiPlus size={20} className="font-pretendard" />
            <span className="text-sm font-medium">New Host</span>
            <HiOutlineHome size={18} className="ml-2 font-medium" />
          </div>
        </button>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        {isModalOpen && <HostModal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />}
      </div>
    </>
  );
};

export default AddHostButton;
