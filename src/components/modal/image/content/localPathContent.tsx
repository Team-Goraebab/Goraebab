import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';

const LocalPathContent = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg w-full h-full">
      <FaFolderOpen className="text-gray-400 mb-4 w-20 h-20" />
      <p className="font-bold text-xl text-gray-400">Local Path</p>
      <p className="text-base text-gray-400 mt-2">
        내 컴퓨터에서 도커 이미지를 가져옵니다.
      </p>
    </div>
  );
};

export default LocalPathContent;
