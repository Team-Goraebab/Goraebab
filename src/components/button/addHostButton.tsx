'use client';

import React, { useState } from 'react';
import HostModal from '../modal/host/hostModal';
import { HiOutlineHome, HiPlus } from 'react-icons/hi';

const AddHostButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="fixed top-20 z-[9] right-[50px] transform translate-x-4 h-[42px] rounded-lg flex items-center justify-between">
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
        {isModalOpen && <HostModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </>
  );
};

export default AddHostButton;
