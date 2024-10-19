'use client';

import { useHandModeStore } from '@/store/handModeStore';
import React, { useEffect } from 'react';
import { FaRegHandPaper } from 'react-icons/fa';
import { HiOutlineCursorClick } from 'react-icons/hi';

const PanButtons = () => {
  const isHandMode = useHandModeStore((state) => state.isHandMode);
  const setHandMode = useHandModeStore((state) => state.setHandMode);

  useEffect(() => {
    const handlePan = (event: MouseEvent) => {
      if (isHandMode && event.buttons === 1) {
        event.preventDefault();
        window.scrollBy(-event.movementX, -event.movementY);
      }
    };

    window.addEventListener('mousemove', handlePan);
    return () => {
      window.removeEventListener('mousemove', handlePan);
    };
  }, [isHandMode]);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (isHandMode && mainElement) {
      mainElement.classList.add('hand-mode');
      const handleMouseDown = () => {
        mainElement.classList.add('grabbing');
      };
      const handleMouseUp = () => {
        mainElement.classList.remove('grabbing');
      };
      mainElement.addEventListener('mousedown', handleMouseDown);
      mainElement.addEventListener('mouseup', handleMouseUp);
      return () => {
        mainElement.removeEventListener('mousedown', handleMouseDown);
        mainElement.removeEventListener('mouseup', handleMouseUp);
      };
    } else if (mainElement) {
      mainElement.classList.remove('hand-mode');
      mainElement.classList.remove('grabbing');
    }
  }, [isHandMode]);

  const handleMouseClick = () => {
    setHandMode(false);
  };

  const handleHandClick = () => {
    setHandMode(true);
  };

  return (
    <div className="fixed top-1/2 right-[40px] transform translate-x-4 w-[40px] p-1 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
      <button
        className={`p-1.5 rounded-lg mb-1 ${
          !isHandMode ? 'bg-blue_1 text-blue_6' : 'text-black'
        }`}
        onClick={handleMouseClick}
      >
        <HiOutlineCursorClick size={20} />
      </button>
      <div className="border-t w-full"></div>
      <button
        className={`p-1.5 rounded-lg mt-1 ${
          isHandMode ? 'bg-blue_1 text-blue_6' : 'text-black'
        }`}
        onClick={handleHandClick}
      >
        <FaRegHandPaper size={20} />
      </button>
    </div>
  );
};

export default PanButtons;
